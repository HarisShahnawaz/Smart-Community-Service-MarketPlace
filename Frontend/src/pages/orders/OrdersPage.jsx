import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyPurchases, getMySales, updateOrderStatus } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';
import { Package, ShoppingBag, ArrowRight, User, Phone, MapPin, CreditCard, Calendar } from 'lucide-react';

const STATUS_STYLES = {
  pending:   'bg-warning/20 text-warning border-warning/30',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800/30',
  shipped:   'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800/30',
  delivered: 'bg-success/20 text-success border-success/30',
  cancelled: 'bg-danger/20 text-danger border-danger/30'
};

const OrdersPage = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('purchases');
  const [updatingId, setUpdatingId] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const [purchasesData, salesData] = await Promise.all([
        getMyPurchases(),
        getMySales()
      ]);
      setPurchases(purchasesData);
      setSales(salesData);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      // Reload orders
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId('');
    }
  };

  const activeOrders = activeTab === 'purchases' ? purchases : sales;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-teal-50 dark:bg-dark-brand/10 text-teal-600 dark:text-dark-brand rounded-2xl">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Order History</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage your marketplace purchases and sales</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-slate-100 dark:bg-dark-surface p-1.5 rounded-2xl w-fit border border-slate-200/50 dark:border-dark-border">
        <button
          onClick={() => setActiveTab('purchases')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'purchases'
              ? 'bg-white dark:bg-dark-surface-elevated text-teal-700 dark:text-dark-brand shadow-sm font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          My Purchases ({purchases.length})
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'sales'
              ? 'bg-white dark:bg-dark-surface-elevated text-teal-700 dark:text-dark-brand shadow-sm font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          My Sales ({sales.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
        </div>
      ) : activeOrders.length === 0 ? (
        <div className="text-center bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-3xl p-12 sm:p-16 shadow-sm">
          <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-2">No orders found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
            {activeTab === 'purchases'
              ? 'You haven\'t made any purchases yet. Explore products in the marketplace and place your first order!'
              : 'You haven\'t sold any products yet. Create a product listing to start selling to the community.'}
          </p>
          {activeTab === 'purchases' && (
            <Link 
              to="/products" 
              className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm"
            >
              Browse Marketplace
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {activeOrders.map((order) => {
            const productInfo = order.productId || {};
            const clientInfo = activeTab === 'purchases' ? order.sellerId : order.buyerId;
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            return (
              <div 
                key={order._id}
                className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-3xl overflow-hidden shadow-sm flex flex-col"
              >
                {/* Order Top Bar */}
                <div className="p-5 border-b border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-dark-surface-elevated/40 flex flex-wrap justify-between items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                      Order ID: #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Placed on {formattedDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border uppercase tracking-wider ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Core Info */}
                <div className="p-6 flex flex-col md:flex-row gap-6">
                  {/* Left: Product Info */}
                  <div className="flex gap-4 flex-1 min-w-0">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-2xl overflow-hidden shrink-0">
                      <img 
                        src={productInfo.images?.[0] || 'https://res.cloudinary.com/demo/image/upload/v1580220268/avatar.png'} 
                        alt={productInfo.title || 'Product'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/products/${productInfo._id}`}
                        className="font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-dark-brand transition-colors text-base line-clamp-1 block"
                      >
                        {productInfo.title || 'Deleted Product'}
                      </Link>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 capitalize">Condition: {productInfo.condition || 'N/A'}</p>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-teal-600 dark:text-dark-brand">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                        {order.quantity > 1 && (
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            (${productInfo.price?.toFixed(2)} × {order.quantity})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-[1px] bg-slate-100 dark:bg-dark-border" />

                  {/* Center: Delivery Details */}
                  <div className="flex-1 min-w-0 text-sm space-y-2.5">
                    <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs">Shipping Address</h4>
                    <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                      <p className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400 shrink-0" /> {order.shippingAddress.fullName}</p>
                      <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400 shrink-0" /> {order.shippingAddress.phone}</p>
                      <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400 shrink-0" /> {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-[1px] bg-slate-100 dark:bg-dark-border" />

                  {/* Right: Payment Method & Seller/Buyer details */}
                  <div className="flex-1 min-w-0 text-sm space-y-2.5">
                    <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs">
                      {activeTab === 'purchases' ? 'Seller Info' : 'Buyer Info'}
                    </h4>
                    <div className="flex items-center gap-3">
                      <img 
                        src={clientInfo?.avatar || 'https://res.cloudinary.com/demo/image/upload/v1580220268/avatar.png'} 
                        alt={clientInfo?.name || 'User'} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-dark-border"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 dark:text-white truncate">{clientInfo?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400 truncate">{clientInfo?.email}</p>
                      </div>
                    </div>
                    
                    <div className="pt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span className="capitalize">{order.paymentMethod.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Seller Actions Bar */}
                {activeTab === 'sales' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="p-4 border-t border-slate-100 dark:border-dark-border bg-slate-50/20 dark:bg-dark-surface/50 flex flex-wrap justify-between items-center gap-4">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      As the seller, you can transition this order's status to fulfill it:
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <select 
                        disabled={updatingId === order._id}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-white dark:bg-dark-surface-elevated border border-slate-300 dark:border-dark-border rounded-xl px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                      >
                        <option value="pending" disabled>Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updatingId === order._id && (
                        <span className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
