package com.samah.store.service.impl;

import com.samah.store.domain.entites.*;
import com.samah.store.domain.enums.CouponType;
import com.samah.store.domain.enums.OrderStatus;
import com.samah.store.domain.enums.Role;
import com.samah.store.dto.*;
import com.samah.store.exception.BadRequestException;
import com.samah.store.exception.ForbiddenException;
import com.samah.store.exception.NotFoundException;
import com.samah.store.repository.*;
import com.samah.store.service.OrderService;
import com.samah.store.service.ShippingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final ProductVariantRepository variantRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final ShippingService shippingService;
    private final UserRepository userRepository;

    public OrderServiceImpl(CartRepository cartRepository,
                            CartItemRepository cartItemRepository,
                            AddressRepository addressRepository,
                            ProductVariantRepository variantRepository,
                            OrderRepository orderRepository,
                            OrderItemRepository orderItemRepository,
                            CouponRepository couponRepository,
                            CouponUsageRepository couponUsageRepository,
                            ShippingService shippingService,
                            UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.addressRepository = addressRepository;
        this.variantRepository = variantRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.couponRepository = couponRepository;
        this.couponUsageRepository = couponUsageRepository;
        this.shippingService = shippingService;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OrderDto placeOrder(Long customerId, OrderPlaceRequest request) {
        // Validate cart exists and has items
        Cart cart = cartRepository.findWithItemsByCustomerId(customerId)
                .orElseThrow(() -> new BadRequestException("السلة فارغة - يرجى إضافة منتجات قبل إتمام الطلب"));
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("السلة فارغة - يرجى إضافة منتجات قبل إتمام الطلب");
        }

        // Validate address ownership
        if (request.addressId() == null) {
            throw new BadRequestException("يرجى اختيار عنوان التوصيل");
        }
        Address address = addressRepository.findByIdAndCustomerId(request.addressId(), customerId)
                .orElseThrow(() -> new BadRequestException("العنوان غير موجود أو لا يخصك"));

        // Validate stock and compute subtotal
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            Long variantId = item.getVariant().getId();
            ProductVariant variant = variantRepository.findByIdAndActiveIsTrueAndDeletedIsFalse(variantId)
                    .orElseThrow(() -> new BadRequestException("أحد المنتجات في السلة غير متوفر حالياً"));

            String productName = variant.getProduct() != null ? variant.getProduct().getName() : "منتج";

            int updated = variantRepository.decrementStockIfAvailable(variant.getId(), item.getQuantity());
            if (updated == 0) {
                throw new BadRequestException("الكمية المطلوبة من '" + productName + "' غير متوفرة في المخزون");
            }
            BigDecimal line = variant.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(line);
        }

        // Coupon
        BigDecimal discount = BigDecimal.ZERO;
        Coupon coupon = null;
        if (request.couponCode() != null && !request.couponCode().isBlank()) {
            coupon = couponRepository.findActiveValidCoupon(request.couponCode().toUpperCase(), Instant.now())
                    .orElseThrow(() -> new BadRequestException("كود الخصم غير صالح أو منتهي الصلاحية"));
            if (coupon.getMinOrderTotal() != null && subtotal.compareTo(coupon.getMinOrderTotal()) < 0) {
                throw new BadRequestException("الحد الأدنى للطلب لاستخدام هذا الكوبون هو " + coupon.getMinOrderTotal() + " دينار");
            }
            long usedTotal = couponUsageRepository.countByCouponId(coupon.getId());
            if (coupon.getUsageLimitTotal() != null && usedTotal >= coupon.getUsageLimitTotal()) {
                throw new BadRequestException("تم استنفاد عدد مرات استخدام هذا الكوبون");
            }
            long usedByUser = couponUsageRepository.countByCouponIdAndCustomerId(coupon.getId(), customerId);
            if (coupon.getUsageLimitPerUser() != null && usedByUser >= coupon.getUsageLimitPerUser()) {
                throw new BadRequestException("لقد استخدمت هذا الكوبون من قبل");
            }
            if (coupon.getType() == CouponType.PERCENT) {
                discount = subtotal.multiply(coupon.getValue()).divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);
            } else {
                discount = coupon.getValue();
            }
            if (discount.compareTo(subtotal) > 0) {
                discount = subtotal;
            }
        }

        // Shipping fee
        BigDecimal shippingFee = shippingService.resolveByCity(address.getCity()).shippingFee();
        BigDecimal total = subtotal.subtract(discount).add(shippingFee);

        Order order = new Order();
        order.setCustomer(address.getCustomer());
        order.setAddress(address);
        order.setSubtotal(subtotal);
        order.setDiscountTotal(discount);
        order.setShippingFee(shippingFee);
        order.setTotal(total);
        order.setStockDeducted(true); // Stock was already decremented above
        order = orderRepository.save(order);

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : cart.getItems()) {
            ProductVariant variant = item.getVariant();
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setVariant(variant);
            oi.setProductName(variant.getProduct().getName());
            oi.setVariantSku(variant.getSku());
            oi.setSize(variant.getSize());
            oi.setColor(variant.getColor());
            oi.setUnitPrice(variant.getPrice());
            oi.setQuantity(item.getQuantity());
            oi.setLineTotal(variant.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            orderItems.add(oi);
        }
        orderItemRepository.saveAll(orderItems);

        if (coupon != null) {
            CouponUsage usage = new CouponUsage();
            usage.setCoupon(coupon);
            usage.setCustomer(address.getCustomer());
            usage.setOrderId(order.getId());
            usage.setUsedAt(Instant.now());
            couponUsageRepository.save(usage);
        }

        cart.getItems().clear();
        cartRepository.save(cart);

        return toDto(order, orderItems, address);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> listMyOrders(Long customerId, Pageable pageable) {
        Page<Order> page = orderRepository.findByCustomerId(customerId, pageable);
        return page.map(o -> toDto(o, orderItemRepository.findByOrderId(o.getId()), o.getAddress()));
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDto getMyOrder(Long customerId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        if (!order.getCustomer().getId().equals(customerId)) {
            throw new ForbiddenException("Order does not belong to user");
        }
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        return toDto(order, items, order.getAddress());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> listAll(Pageable pageable) {
        Page<Order> page = orderRepository.findAllBy(pageable);
        return page.map(o -> toDto(o, orderItemRepository.findByOrderId(o.getId()), o.getAddress()));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> listByDeliveredStatus(boolean delivered, Pageable pageable) {
        Page<Order> page;
        if (delivered) {
            // Delivered tab: only DELIVERED status
            page = orderRepository.findByStatus(OrderStatus.DELIVERED, pageable);
        } else {
            // Active tab: NEW, PROCESSING, and SHIPPED (exclude DELIVERED and FAILED_PICKUP)
            page = orderRepository.findByStatusIn(
                java.util.List.of(OrderStatus.NEW, OrderStatus.PROCESSING, OrderStatus.SHIPPED),
                pageable
            );
        }
        return page.map(o -> toDto(o, orderItemRepository.findByOrderId(o.getId()), o.getAddress()));
    }

    @Override
    @Transactional
    public OrderDto updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + status);
        }

        // Restrict to only 5 allowed statuses (added NEW)
        if (newStatus != OrderStatus.NEW &&
            newStatus != OrderStatus.PROCESSING &&
            newStatus != OrderStatus.SHIPPED &&
            newStatus != OrderStatus.DELIVERED &&
            newStatus != OrderStatus.FAILED_PICKUP) {
            throw new BadRequestException("يمكن تحديث الحالة إلى: جديد، قيد المعالجة، تم الشحن، تم التوصيل، أو تعذر الاستلام فقط");
        }

        OrderStatus oldStatus = order.getStatus();

        // Allow idempotent updates (same status)
        if (oldStatus == newStatus) {
            // No change needed - return current state
            List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
            return toDto(order, items, order.getAddress());
        }

        // Validate state transitions - cannot revert from terminal states
        if (oldStatus == OrderStatus.DELIVERED || oldStatus == OrderStatus.FAILED_PICKUP) {
            throw new BadRequestException("لا يمكن تغيير حالة الطلب بعد التوصيل أو تعذر الاستلام");
        }

        // Validate forward transitions only
        // Allow: NEW -> PROCESSING/SHIPPED
        //        PROCESSING -> SHIPPED/DELIVERED
        //        SHIPPED -> DELIVERED/FAILED_PICKUP
        boolean validTransition = false;

        if (oldStatus == OrderStatus.NEW) {
            validTransition = (newStatus == OrderStatus.PROCESSING || newStatus == OrderStatus.SHIPPED);
        } else if (oldStatus == OrderStatus.PROCESSING) {
            validTransition = (newStatus == OrderStatus.SHIPPED || newStatus == OrderStatus.DELIVERED);
        } else if (oldStatus == OrderStatus.SHIPPED) {
            validTransition = (newStatus == OrderStatus.DELIVERED || newStatus == OrderStatus.FAILED_PICKUP);
        }

        if (!validTransition) {
            throw new BadRequestException("لا يمكن التحويل من " + oldStatus + " إلى " + newStatus);
        }

        // Stock was already deducted at order placement - no need to deduct again
        order.setStatus(newStatus);
        order = orderRepository.save(order);

        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        return toDto(order, items, order.getAddress());
    }

    @Override
    @Transactional
    public OrderDto assignEmployee(Long orderId, Long employeeId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new NotFoundException("Employee not found"));
        if (employee.getRole() != Role.EMPLOYEE) {
            throw new BadRequestException("User is not an employee");
        }
        order.setAssignedEmployee(employee);
        order = orderRepository.save(order);
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        return toDto(order, items, order.getAddress());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> listEmployeeOrders(Long employeeId, Pageable pageable) {
        Page<Order> page = orderRepository.findByAssignedEmployeeId(employeeId, pageable);
        return page.map(o -> toDto(o, orderItemRepository.findByOrderId(o.getId()), o.getAddress()));
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDto getEmployeeOrder(Long employeeId, Long orderId) {
        Order order = orderRepository.findWithDetailsById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        if (order.getAssignedEmployee() == null || !order.getAssignedEmployee().getId().equals(employeeId)) {
            throw new ForbiddenException("Order not assigned to this employee");
        }
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        return toDto(order, items, order.getAddress());
    }

    @Override
    @Transactional
    public OrderDto updateEmployeeOrderStatus(Long employeeId, Long orderId, String status) {
        Order order = orderRepository.findWithDetailsById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        if (order.getAssignedEmployee() == null || !order.getAssignedEmployee().getId().equals(employeeId)) {
            throw new ForbiddenException("Order not assigned to this employee");
        }

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status value");
        }

        if (newStatus != OrderStatus.PROCESSING && newStatus != OrderStatus.SHIPPED && newStatus != OrderStatus.DELIVERED) {
            throw new BadRequestException("Employee can only set status to PROCESSING, SHIPPED, or DELIVERED");
        }

        OrderStatus currentStatus = order.getStatus();
        if (currentStatus == OrderStatus.PROCESSING && newStatus == OrderStatus.SHIPPED) {
            order.setStatus(newStatus);
        } else if (currentStatus == OrderStatus.SHIPPED && newStatus == OrderStatus.DELIVERED) {
            order.setStatus(newStatus);
        } else if (currentStatus == newStatus) {
            // No change - do nothing
        } else {
            throw new BadRequestException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }

        order = orderRepository.save(order);
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        return toDto(order, items, order.getAddress());
    }

    private OrderDto toDto(Order order, List<OrderItem> items, Address address) {
        AddressDto addrDto = new AddressDto(address.getId(), address.getCity(), address.getStreet(), address.getDetails(), address.getPhone());

        // Customer info
        User customer = order.getCustomer();
        CustomerInfoDto customerDto = new CustomerInfoDto(
            customer.getId(),
            customer.getUsername(),
            customer.getEmail()
        );

        // Assigned employee (optional)
        AssignedEmployeeDto employeeDto = null;
        if (order.getAssignedEmployee() != null) {
            User emp = order.getAssignedEmployee();
            employeeDto = new AssignedEmployeeDto(emp.getId(), emp.getUsername(), emp.getEmail());
        }

        List<OrderItemDto> itemDtos = items.stream()
                .map(i -> new OrderItemDto(i.getId(), i.getProductName(), i.getVariantSku(), i.getSize(), i.getColor(), i.getUnitPrice(), i.getQuantity(), i.getLineTotal()))
                .toList();

        return new OrderDto(
            order.getId(),
            order.getStatus(),
            order.getPaymentMethod(),
            order.getSubtotal(),
            order.getShippingFee(),
            order.getDiscountTotal(),
            order.getTotal(),
            order.getTrackingCode(),
            customerDto,
            addrDto,
            employeeDto,
            itemDtos,
            order.getCreatedAt()
        );
    }
}

