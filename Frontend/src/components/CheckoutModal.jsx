import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, CreditCard, Truck, Check, ChevronRight, ChevronLeft, CreditCard as CardIcon } from 'lucide-react';
import { createOrder } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';

const CheckoutModal = ({ isOpen, onClose, product, onOrderSuccess }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.contactNumber || '',
    addressLine: '',
    city: user?.location?.city || '',
    postalCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

  if (!isOpen || !product) return null;

  const itemPrice = product.price;
  const deliveryFee = 5.00;
  const totalPrice = (itemPrice * quantity) + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    const { fullName, phone, addressLine, city, postalCode } = shippingAddress;
    return fullName && phone && addressLine && city && postalCode;
  };

  const validateCard = () => {
    if (paymentMethod === 'cash_on_delivery') return true;
    const { number, expiry, cvv } = cardDetails;
    return number.replace(/\s?/g, '').length >= 16 && expiry && cvv.length >= 3;
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!validateShipping()) {
        setError('Please fill in all shipping fields');
        return;
      }
      setError('');
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCard()) {
      setError('Please provide valid card details (16 digit number, expiry, 3 digit CVV)');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const orderData = {
        productId: product._id,
        quantity,
        shippingAddress,
        paymentMethod
      };
      const createdOrder = await createOrder(orderData);
      setStep(4);
      if (onOrderSuccess) {
        onOrderSuccess(createdOrder);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window - tightened max-width and max-height */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative bg-white dark:bg-dark-surface border-t sm:border border-slate-200 dark:border-dark-border w-full max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh] sm:max-h-[80vh]"
        >
          {/* Header - reduced padding */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-dark-border flex justify-between items-center bg-slate-50/55 dark:bg-dark-surface/50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-teal-600 dark:text-dark-brand" />
              <h2 className="text-base font-bold text-slate-800 dark:text-white">Checkout</h2>
            </div>
            {step < 4 && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 bg-slate-100 dark:bg-dark-surface-elevated rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Progress Indicators - more compact */}
          {step < 4 && (
            <div className="flex px-4 py-2 bg-slate-50/30 dark:bg-dark-surface/20 border-b border-slate-100 dark:border-dark-border justify-between text-[10px] font-semibold text-slate-400 dark:text-slate-500 flex-shrink-0">
              <span className={step >= 1 ? 'text-teal-600 dark:text-dark-brand' : ''}>1. Summary</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className={step >= 2 ? 'text-teal-600 dark:text-dark-brand' : ''}>2. Shipping</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className={step >= 3 ? 'text-teal-600 dark:text-dark-brand' : ''}>3. Payment</span>
            </div>
          )}

          {/* Content Body - reduced padding and spacing */}
          <div className="p-4 overflow-y-auto flex-grow space-y-3">
            {error && (
              <div className="p-2.5 bg-danger/10 text-danger border border-danger/25 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            {/* STEP 1: Summary */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex gap-3 p-3 bg-slate-50 dark:bg-dark-bg rounded-xl border border-slate-100 dark:border-dark-border">
                  <img
                    src={product.images?.[0] || 'https://res.cloudinary.com/demo/image/upload/v1580220268/avatar.png'}
                    alt={product.title}
                    className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-dark-border"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 dark:text-white truncate text-sm">{product.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">Condition: {product.condition}</p>
                    <p className="font-semibold text-teal-600 dark:text-dark-brand text-base mt-1">${product.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-y border-slate-100 dark:border-dark-border py-3">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Quantity</span>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-surface-elevated rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-white transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="font-bold text-slate-800 dark:text-white w-5 text-center text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-surface-elevated rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-white transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800 dark:text-white">${(itemPrice * quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee (flat)</span>
                    <span className="font-semibold text-slate-800 dark:text-white">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 dark:border-dark-border pt-2 text-sm text-slate-800 dark:text-white font-extrabold">
                    <span>Total</span>
                    <span className="text-teal-600 dark:text-dark-brand">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Shipping Form */}
            {step === 2 && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">Enter Shipping Address</h3>
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +123456789"
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Address Line</label>
                    <input
                      type="text"
                      name="addressLine"
                      value={shippingAddress.addressLine}
                      onChange={handleInputChange}
                      placeholder="Street address, apartment, suite"
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-800 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleInputChange}
                        placeholder="Postal Code"
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Method & Mock Form */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">Select Payment Method</h3>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => { setPaymentMethod('cash_on_delivery'); setError(''); }}
                    className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-1.5 transition-all hover:bg-slate-50 dark:hover:bg-dark-surface-elevated ${paymentMethod === 'cash_on_delivery'
                        ? 'border-teal-600 bg-teal-50/20 dark:bg-dark-brand/10 dark:border-dark-brand'
                        : 'border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface'
                      }`}
                  >
                    <Truck className={`w-5 h-5 ${paymentMethod === 'cash_on_delivery' ? 'text-teal-600 dark:text-dark-brand' : 'text-slate-400'}`} />
                    <span className={`text-xs font-semibold ${paymentMethod === 'cash_on_delivery' ? 'text-teal-700 dark:text-dark-brand' : 'text-slate-600 dark:text-slate-300'}`}>Cash on Delivery</span>
                  </button>

                  <button
                    onClick={() => { setPaymentMethod('demo_card'); setError(''); }}
                    className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-1.5 transition-all hover:bg-slate-50 dark:hover:bg-dark-surface-elevated ${paymentMethod === 'demo_card'
                        ? 'border-teal-600 bg-teal-50/20 dark:bg-dark-brand/10 dark:border-dark-brand'
                        : 'border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface'
                      }`}
                  >
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'demo_card' ? 'text-teal-600 dark:text-dark-brand' : 'text-slate-400'}`} />
                    <span className={`text-xs font-semibold ${paymentMethod === 'demo_card' ? 'text-teal-700 dark:text-dark-brand' : 'text-slate-600 dark:text-slate-300'}`}>Demo Card</span>
                  </button>
                </div>

                {paymentMethod === 'demo_card' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg/60 rounded-xl space-y-3"
                  >
                    <div className="relative w-full aspect-[1.586/1] max-w-[220px] mx-auto bg-gradient-to-br from-teal-600 to-teal-800 text-white rounded-xl p-3.5 shadow-lg flex flex-col justify-between select-none">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] uppercase tracking-widest font-semibold opacity-70">Demo Card</span>
                        <CardIcon className="w-6 h-6 opacity-90" />
                      </div>
                      <div className="space-y-2.5">
                        <p className="text-sm font-bold tracking-widest leading-none font-mono">
                          {cardDetails.number || '•••• •••• •••• ••••'}
                        </p>
                        <div className="flex justify-between text-[10px]">
                          <div>
                            <span className="block uppercase tracking-wider opacity-60 text-[8px]">Card Holder</span>
                            <span className="font-bold truncate max-w-[110px] block">{shippingAddress.fullName || 'YOUR NAME'}</span>
                          </div>
                          <div className="text-right">
                            <span className="block uppercase tracking-wider opacity-60 text-[8px]">Expires</span>
                            <span className="font-bold block font-mono">{cardDetails.expiry || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Card Number</label>
                        <input
                          type="text"
                          name="number"
                          maxLength="19"
                          value={cardDetails.number}
                          onChange={(e) => {
                            e.target.value = formatCardNumber(e.target.value);
                            handleCardChange(e);
                          }}
                          placeholder="4111 2222 3333 4444"
                          className="w-full px-3 py-1.5 text-sm bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-800 dark:text-white font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            name="expiry"
                            maxLength="5"
                            value={cardDetails.expiry}
                            onChange={(e) => {
                              e.target.value = formatExpiry(e.target.value);
                              handleCardChange(e);
                            }}
                            placeholder="MM/YY"
                            className="w-full px-3 py-1.5 text-sm bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-800 dark:text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">CVV</label>
                          <input
                            type="password"
                            name="cvv"
                            maxLength="3"
                            value={cardDetails.cvv}
                            onChange={(e) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                              handleCardChange(e);
                            }}
                            placeholder="•••"
                            className="w-full px-3 py-1.5 text-sm bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-800 dark:text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-dark-border rounded-xl">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total to Charge:</span>
                  <span className="text-lg font-extrabold text-teal-600 dark:text-dark-brand">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* STEP 4: Success Screen */}
            {step === 4 && (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 bg-success text-white rounded-full flex items-center justify-center shadow-lg shadow-success/20"
                >
                  <Check className="w-8 h-8" />
                </motion.div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Order Placed Successfully!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Your demo order was created. The seller has been notified about the transaction.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-dark-border rounded-xl w-full text-left space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Product:</span>
                    <span className="font-bold text-slate-800 dark:text-white">{product.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span className="font-bold text-slate-800 dark:text-white">{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Charged:</span>
                    <span className="font-bold text-teal-600 dark:text-dark-brand text-sm">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-bold capitalize text-slate-800 dark:text-white">{paymentMethod.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls - reduced padding */}
          <div className="p-3.5 border-t border-slate-100 dark:border-dark-border flex bg-slate-50/50 dark:bg-dark-surface/30 justify-between items-center gap-2.5 flex-shrink-0">
            {step === 4 ? (
              <div className="flex w-full gap-2.5">
                <button
                  onClick={() => {
                    onClose();
                    window.location.href = '/orders';
                  }}
                  className="flex-1 py-2.5 text-center bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-bold transition-all hover:shadow-md cursor-pointer"
                >
                  View My Orders
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 text-center bg-slate-200 hover:bg-slate-300 dark:bg-dark-surface-elevated dark:hover:bg-slate-800 text-slate-700 dark:text-white rounded-lg text-sm font-bold transition-all cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {step > 1 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 px-3.5 py-2 border border-slate-300 dark:border-dark-border text-slate-700 dark:text-white font-semibold rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center justify-center px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;