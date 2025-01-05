import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductDetail.css';
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addresses, setAddresses] = useState([]); 
  const [selectedAddress, setSelectedAddress] = useState(null); 
  const [showAddressModal, setShowAddressModal] = useState(false); 
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    receiver_name: "",
    receiver_phone_number: "",
    address_line_1: "",
    city: "",
    state: "",
    zip_code: "",
  });
  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => {
    axios
      .get(`http://sharmasteel.in:8080/products/product-details/${productId}`)
      .then((response) => {
        const productData = response.data.product;
        setProduct(productData);
        setQuantity(productData.minimum_order_quantity || 1);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });
  }, [productId]);

  const fetchAddresses = async () => {
    const userToken = localStorage.getItem("accessToken");
    if (!userToken) {
      alert("Please log in to view addresses.");
      navigate("/login");
      return;
    }
  
    try {
      const response = await axios.get(
        "http://sharmasteel.in:8080/user-accounts/addresses/",
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
  
      const fetchedAddresses = response.data.user_Addresses || [];
      setAddresses(fetchedAddresses);
  
      // Set the first address as the default selected address if available
      if (fetchedAddresses.length > 0) {
        setSelectedAddress(fetchedAddresses[0]);
      }
  
      setShowAddressModal(true);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      alert("Failed to fetch addresses.");
    }
  };
  

  const handleAddToCart = () => {
    const userToken = localStorage.getItem('accessToken');
    if (!userToken) {
      alert('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }

    const cartData = {
      product_id: productId,
      quantity: quantity,
      minimum_order_quantity: product.minimum_order_quantity,
    };

    axios
      .post('http://sharmasteel.in:8080/cart/add-to-cart/', cartData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log('Item added to cart successfully:', response.data);
        alert('Item added to cart successfully!');
      })
      .catch((error) => {
        console.error('Error adding item to cart:', error);
        alert('Failed to add item to cart. Please try again.');
      });
  };

  const handleBuyNow = () => {
    fetchAddresses(); 
  };
  const proceedWithSelectedAddress = () => {
    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }
  
    const userToken = localStorage.getItem("accessToken");
    const requestData = {
      product_id: productId,
      quantity,
      address_id: selectedAddress.id, // Pass address_id
    };
  
    axios
      .post("http://sharmasteel.in:8080/cart/buy-now/", requestData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const orderData = {
          total_price: response.data.total_price,
          items: response.data.items,
          address_id: selectedAddress.id, // Include only the address ID
        };
  
        setShowAddressModal(false);
        navigate("/order-summary", { state: { orderData } });
      })
      .catch((error) => {
        console.error("Error during Buy Now:", error);
        alert("Failed to process your purchase. Please try again.");
      });
  };
  


  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) =>
      prevQuantity > product.minimum_order_quantity
        ? prevQuantity - 1
        : prevQuantity
    );
  };
  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
  
    try {
      await axios.post(
        "http://sharmasteel.in:8080/user-accounts/addresses/",
        newAddress,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const response = await axios.get(
        "http://sharmasteel.in:8080/user-accounts/addresses/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const updatedAddresses = response.data.user_Addresses || [];
      setAddresses(updatedAddresses);
  
      // Automatically select the newly added address
      setSelectedAddress(updatedAddresses[updatedAddresses.length - 1]);
  
      setShowAddAddressForm(false);
      alert("Address added successfully!");
    } catch (err) {
      console.error("Error adding new address:", err);
      alert("Failed to add new address. Please try again.");
    }
  };
  

  if (!product) return <p>Loading...</p>;

  return (
    <div className='product-div'>
      <div className='product-detail-container'>
        <div className='product-detail-img-container'>
          <img
            src={`http://sharmasteel.in:8080${product.product_image_main}`}
            alt='Main Product'
          />
          {product.additional_images.map((img, index) => (
            <img
              key={index}
              src={`http://sharmasteel.in:8080${img.image}`}
              alt={`Additional ${index + 1}`}
            />
          ))}
        </div>

        <div className='product-details'>
          <h1>{product.brand_name}</h1>
          <p>{product.specification}</p>
          <p>In Stock: {product.in_stock ? 'Yes' : 'No'}</p>
          <p className='product-price'>
            {product.discount ? (
              <>
                ₹{product.selling_price}/{product.unit_of_measurement}{' '}
                {product.mrp && (
                  <span
                    className='old-price'
                    style={{ textDecoration: 'line-through', color: 'gray' }}
                  >
                    ₹{product.mrp}/{product.unit_of_measurement}
                  </span>
                )}
              </>
            ) : (
              <>₹{product.mrp}/{product.unit_of_measurement}</>
            )}
          </p>
          <div className='quantity-control'>
            Minimum Order Quantity:
            <button onClick={decreaseQuantity} className='quantity-button'>
              -
            </button>
            <span className='quantity-display'>{quantity}</span>
            <button onClick={increaseQuantity} className='quantity-button'>
              +
            </button>
          </div>

          <div className='add-buy-container'>
            <button className='add-button' onClick={handleAddToCart}>
              Add To Cart
            </button>
            <button className='buy-now' onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
  <div className='address-modal'>
    <div className='modal-content'>
      <h3>Select Delivery Address</h3>
      <ul>
        {addresses.map((address) => (
          <li key={address.id}>
            <label>
              <input
                type='radio'
                name='address'
                value={address.id}
                checked={selectedAddress?.id === address.id}
                onChange={() => setSelectedAddress(address)}
              />
              {address.city}, {address.state}, {address.country} -{" "}
              {address.zip_code}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={proceedWithSelectedAddress}>Proceed</button>
      <button onClick={() => setShowAddressModal(false)}>Cancel</button>
      <button onClick={() => setShowAddAddressForm(true)}>Add New Address</button>
    </div>
  </div>
)}

{/* Add New Address Modal */}
{showAddAddressForm && (
  <div className='modal-overlay'>
    <div className='modal-content'>
      <h2>Add New Address</h2>
      <form onSubmit={handleAddNewAddress} className='addressmodal-div12'>
        <input
          type='text'
          name='receiver_name'
          placeholder='Receiver Name'
          value={newAddress.receiver_name}
          onChange={(e) => setNewAddress({ ...newAddress, receiver_name: e.target.value })}
          required
        />
        <input
          type='text'
          name='receiver_phone_number'
          placeholder='Phone Number'
          value={newAddress.receiver_phone_number}
          onChange={(e) =>
            setNewAddress({ ...newAddress, receiver_phone_number: e.target.value })
          }
          required
        />
        <input
          type='text'
          name='address_line_1'
          placeholder='Address'
          value={newAddress.address_line_1}
          onChange={(e) => setNewAddress({ ...newAddress, address_line_1: e.target.value })}
          required
        />
        <input
          type='text'
          name='city'
          placeholder='City'
          value={newAddress.city}
          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
          required
        />
        <input
          type='text'
          name='state'
          placeholder='State'
          value={newAddress.state}
          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
          required
        />
        <input
          type='text'
          name='zip_code'
          placeholder='Zip Code'
          value={newAddress.zip_code}
          onChange={(e) => setNewAddress({ ...newAddress, zip_code: e.target.value })}
          required
        />
        <button type='submit'>Submit</button>
        <button type='button' onClick={() => setShowAddAddressForm(false)}>
          Cancel
        </button>
      </form>
    </div>
  </div>
)}

      {showAddAddressForm && (
  <div className='modal-overlay'>
    <div className='modal-content'>
      <h2>Add New Address</h2>
      <form onSubmit={handleAddNewAddress}>
        <input
          type='text'
          name='receiver_name'
          placeholder='Receiver Name'
          value={newAddress.receiver_name}
          onChange={(e) => setNewAddress({ ...newAddress, receiver_name: e.target.value })}
          required
        />
        <input
          type='text'
          name='receiver_phone_number'
          placeholder='Phone Number'
          value={newAddress.receiver_phone_number}
          onChange={(e) =>
            setNewAddress({ ...newAddress, receiver_phone_number: e.target.value })
          }
          required
        />
        <input
          type='text'
          name='address_line_1'
          placeholder='Address'
          value={newAddress.address_line_1}
          onChange={(e) => setNewAddress({ ...newAddress, address_line_1: e.target.value })}
          required
        />
        <input
          type='text'
          name='city'
          placeholder='City'
          value={newAddress.city}
          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
          required
        />
        <input
          type='text'
          name='state'
          placeholder='State'
          value={newAddress.state}
          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
          required
        />
        <input
          type='text'
          name='zip_code'
          placeholder='Zip Code'
          value={newAddress.zip_code}
          onChange={(e) => setNewAddress({ ...newAddress, zip_code: e.target.value })}
          required
        />
        <button type='submit'>Submit</button>
        <button type='button' onClick={() => setShowAddAddressForm(false)}>
          Cancel
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default ProductDetail;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './ProductDetail.css';
// import { useNavigate, useParams  } from 'react-router-dom';

// const ProductDetail = () => {
//     const [product, setProduct] = useState(null);
//     const [quantity, setQuantity] = useState(1);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const navigate = useNavigate()
//     const [orderDetails, setOrderDetails] = useState(null);
//     const { productId } = useParams();
//     useEffect(() => {
//         axios.get(`http://sharmasteel.in:8080/products/product-details/${productId}`)
//             .then(response => {
//                 const productData = response.data.product;
//                 setProduct(productData);
//                 setQuantity(productData.minimum_order_quantity || 1); 
//             })
//             .catch(error => {
//                 console.error('Error fetching product data:', error);
//             });
//     }, [productId]);

//     const increaseQuantity = () => {
//         setQuantity(prevQuantity => prevQuantity + 1);
//     };

//     const decreaseQuantity = () => {
//         setQuantity(prevQuantity => 
//             prevQuantity > product.minimum_order_quantity ? prevQuantity - 1 : prevQuantity
//         );
//     };

//     if (!product) return <p>Loading...</p>;



//     const handleAddToCart = () => {
//         const userToken = localStorage.getItem('accessToken'); 
//         if (!userToken) {
//             alert("Please log in to add items to your cart.");
//             navigate('/login');
//             return;
//         }
    
//         const cartData = {
//             product_id: productId,
//             quantity: quantity,
//             minimum_order_quantity: product.minimum_order_quantity,
//         };
    
//         axios
//             .post('http://sharmasteel.in:8080/cart/add-to-cart/', cartData, {
//                 headers: {
//                     Authorization: `Bearer ${userToken}`,
//                     'Content-Type': 'application/json',
//                 },
//             })
//             .then(response => {
//                 console.log('Item added to cart successfully:', response.data);
//                 alert('Item added to cart successfully!');
//             })
//             .catch(error => {
//                 console.error('Error adding item to cart:', error);
//                 alert('Failed to add item to cart. Please try again.');
//             });
//     };
    
    
//     const handleBuyNow = () => {
//         const userToken = localStorage.getItem("accessToken");
      
//         if (!userToken) {
//           alert("Please log in to proceed with your purchase.");
//           navigate("/login");
//           return;
//         }
      
//         const requestData = {
//           product_id: productId,
//           quantity: quantity,
//         };
      
//         axios
//           .post("http://sharmasteel.in:8080/cart/buy-now/", requestData, {
//             headers: {
//               Authorization: `Bearer ${userToken}`,
//               "Content-Type": "application/json",
//             },
//           })
//           .then((response) => {
//             console.log("Buy Now successful:", response.data);
      
//             const apiItem = response.data.items[0];
//             const singleOrderData = {
//               total_price: response.data.total_price,
//               items: [
//                 {
//                   quantity: apiItem.quantity,
//                   base_price: apiItem.base_price,
//                   product_details: {
//                     brand_name: apiItem.product_details.brand_name,
//                     specification: apiItem.product_details.specification,
//                     selling_price: apiItem.product_details.selling_price,
//                     mrp: apiItem.product_details.mrp,
//                     unit_of_measurement: apiItem.product_details.unit_of_measurement,
//                     product_image_main: apiItem.product_details.product_image_main,
//                     discount: apiItem.product_details.discount,
//                   },
//                   extra_charges_breakdown: apiItem.extra_charges_breakdown || [],
//                   total_price: apiItem.total_price,
//                 },
//               ],
//             };
      
//             navigate("/order-summary", { state: { orderData: singleOrderData } });
//           })
//           .catch((error) => {
//             console.error("Error during Buy Now:", error);
//             alert("Failed to process your purchase. Please try again.");
//           });
//       };
      
      
      
    
    
//     return (
//         <div className='product-div'>
//             <div className='product-detail-container'>
//                 <div className='product-detail-img-container'>
//                     <img 
//                         src={`http://sharmasteel.in:8080${product.product_image_main}`} 
//                         alt="Main Product" 
//                     />
                    
//                     {product.additional_images.map((img, index) => (
//                         <img 
//                             key={index} 
//                             src={`http://sharmasteel.in:8080${img.image}`} 
//                             alt={`Additional ${index + 1}`} 
//                         />
//                     ))}
//                 </div>
                
//                 <div className='product-details'>
//                     <h1>{product.brand_name}</h1>
//                     <p>{product.specification}</p>
                   
//                     <p>In Stock: {product.in_stock ? 'Yes' : 'No'}</p>

//                     <p className="product-price">
//                         {product.discount ? (
//                             <>
//                                 ₹{product.selling_price}/{product.unit_of_measurement}{' '}
//                                 {product.mrp && (
//                                     <span className="old-price" style={{ textDecoration: 'line-through', color: 'gray' }}>
//                                         ₹{product.mrp}/{product.unit_of_measurement}
//                                     </span>
//                                 )}
//                             </>
//                         ) : (
//                             <>
//                                 ₹{product.mrp}/{product.unit_of_measurement}
//                             </>
//                         )}
//                     </p>

//                     <div className="quantity-control">
//                     Minimum Order Quantity: 
//                     <button onClick={decreaseQuantity} className="quantity-button">-</button>
//                         <span className="quantity-display">{quantity}</span>
                      
//                         <button onClick={increaseQuantity} className="quantity-button">+</button>
//                     </div>

//                     <div className='add-buy-container'>
//                         <button className='add-button' onClick={handleAddToCart}>Add To Cart</button>
//                         <button className='buy-now' onClick={handleBuyNow}>Buy Now</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductDetail;
