import { useState } from 'react'

// Sample menu data
const SAMPLE_MENU = [
  { id: 1, name: 'Margherita Pizza', price: 12.99, category: 'Pizza' },
  { id: 2, name: 'Pepperoni Pizza', price: 14.99, category: 'Pizza' },
  { id: 3, name: 'Caesar Salad', price: 8.99, category: 'Salads' },
  { id: 4, name: 'Chicken Wings (10pc)', price: 11.99, category: 'Appetizers' },
  { id: 5, name: 'Garlic Bread', price: 5.99, category: 'Appetizers' },
  { id: 6, name: 'Chicken Parmesan', price: 16.99, category: 'Entrees' },
  { id: 7, name: 'Spaghetti Carbonara', price: 15.99, category: 'Entrees' },
  { id: 8, name: 'Tiramisu', price: 6.99, category: 'Desserts' },
  { id: 9, name: 'Coca Cola', price: 2.99, category: 'Drinks' },
  { id: 10, name: 'Iced Tea', price: 2.49, category: 'Drinks' },
]

const DELIVERY_FEE = 5.00

function App() {
  const [restaurantName, setRestaurantName] = useState('')
  const [groupSize, setGroupSize] = useState(1)
  const [carts, setCarts] = useState([{ id: 1, items: [] }])
  const [orderCreated, setOrderCreated] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState(1)

  const handleCreateOrder = () => {
    if (restaurantName.trim()) {
      setOrderCreated(true)
      setCarts([{ id: 1, items: [] }])
    }
  }

  const addToCart = (personId, menuItem) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6b69653d-88ee-4b9e-8c1d-6128a1a54b0d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:33',message:'addToCart called',data:{personId,menuItemId:menuItem.id,menuItemName:menuItem.name},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    setCarts(prevCarts => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6b69653d-88ee-4b9e-8c1d-6128a1a54b0d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:35',message:'setCarts callback - state before update',data:{prevCartsLength:prevCarts.length,cartItems:prevCarts.find(c=>c.id===personId)?.items.map(i=>({id:i.id,name:i.name,qty:i.quantity}))||[]},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      // Deep copy to prevent React.StrictMode double-invocation issues
      const newCarts = prevCarts.map(cart => ({
        ...cart,
        items: cart.items.map(item => ({ ...item }))
      }))
      const cartIndex = newCarts.findIndex(cart => cart.id === personId)
      
      if (cartIndex !== -1) {
        const existingItemIndex = newCarts[cartIndex].items.findIndex(
          item => item.id === menuItem.id
        )
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6b69653d-88ee-4b9e-8c1d-6128a1a54b0d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:42',message:'Before quantity update',data:{existingItemIndex,currentQuantity:existingItemIndex!==-1?newCarts[cartIndex].items[existingItemIndex].quantity:0},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        
        if (existingItemIndex !== -1) {
          newCarts[cartIndex].items[existingItemIndex].quantity += 1
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/6b69653d-88ee-4b9e-8c1d-6128a1a54b0d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:44',message:'After increment - existing item',data:{newQuantity:newCarts[cartIndex].items[existingItemIndex].quantity},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
        } else {
          newCarts[cartIndex].items.push({ ...menuItem, quantity: 1 })
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/6b69653d-88ee-4b9e-8c1d-6128a1a54b0d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:46',message:'After push - new item',data:{newQuantity:1},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
        }
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6b69653d-88ee-4b9e-8c1d-6128a1a54b0d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:50',message:'setCarts callback - state after update',data:{newCartsLength:newCarts.length,updatedCartItems:newCarts.find(c=>c.id===personId)?.items.map(i=>({id:i.id,name:i.name,qty:i.quantity}))||[]},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      return newCarts
    })
  }

  const updateQuantity = (personId, itemId, delta) => {
    setCarts(prevCarts => {
      // Deep copy to prevent React.StrictMode double-invocation issues
      const newCarts = prevCarts.map(cart => ({
        ...cart,
        items: cart.items.map(item => ({ ...item }))
      }))
      const cartIndex = newCarts.findIndex(cart => cart.id === personId)
      
      if (cartIndex !== -1) {
        const itemIndex = newCarts[cartIndex].items.findIndex(item => item.id === itemId)
        
        if (itemIndex !== -1) {
          newCarts[cartIndex].items[itemIndex].quantity += delta
          
          if (newCarts[cartIndex].items[itemIndex].quantity <= 0) {
            newCarts[cartIndex].items.splice(itemIndex, 1)
          }
        }
      }
      
      return newCarts
    })
  }

  const handleGroupSizeChange = (newSize) => {
    const size = Math.max(1, parseInt(newSize) || 1)
    setGroupSize(size)
    
    // Adjust carts array to match group size
    setCarts(prevCarts => {
      const newCarts = []
      for (let i = 1; i <= size; i++) {
        const existingCart = prevCarts.find(cart => cart.id === i)
        newCarts.push(existingCart || { id: i, items: [] })
      }
      return newCarts
    })
    
    // Ensure selected person is within valid range
    if (selectedPerson > size) {
      setSelectedPerson(1)
    }
  }

  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateGroupTotal = () => {
    return carts.reduce((sum, cart) => sum + calculateSubtotal(cart.items), 0)
  }

  const calculateDeliveryFeePerPerson = () => {
    return groupSize > 0 ? DELIVERY_FEE / groupSize : 0
  }

  const calculatePersonTotal = (subtotal) => {
    return subtotal + calculateDeliveryFeePerPerson()
  }

  if (!orderCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            weOrder
          </h1>
          <p className="text-center text-gray-600 mb-6">Create a Group Order</p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="restaurant" className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name
              </label>
              <input
                id="restaurant"
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Enter restaurant name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateOrder()}
              />
            </div>
            
            <button
              onClick={handleCreateOrder}
              disabled={!restaurantName.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Create Order
            </button>
          </div>
        </div>
      </div>
    )
  }

  const groupSubtotal = calculateGroupTotal()
  const deliveryFeePerPerson = calculateDeliveryFeePerPerson()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {restaurantName}
              </h1>
              <p className="text-gray-600 mt-1">Group Order</p>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label htmlFor="groupSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Group Size
                </label>
                <input
                  id="groupSize"
                  type="number"
                  min="1"
                  value={groupSize}
                  onChange={(e) => handleGroupSizeChange(e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
                <div className="flex items-center gap-2">
                  <label htmlFor="personSelect" className="text-sm font-medium text-gray-700">
                    Adding to:
                  </label>
                  <select
                    id="personSelect"
                    value={selectedPerson}
                    onChange={(e) => setSelectedPerson(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    {carts.map(cart => (
                      <option key={cart.id} value={cart.id}>
                        Person {cart.id}'s Cart
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                {SAMPLE_MENU.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-blue-600">
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => {
                          // #region agent log
                          fetch('http://127.0.0.1:7242/ingest/6b69653d-88ee-4b9e-8c1d-6128a1a54b0d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:221',message:'Button onClick fired',data:{itemId:item.id,itemName:item.name,selectedPerson},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                          // #endregion
                          addToCart(selectedPerson, item)
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Carts and Totals Section */}
          <div className="space-y-6">
            {/* Individual Carts */}
            {carts.map((cart, index) => {
              const subtotal = calculateSubtotal(cart.items)
              const personTotal = calculatePersonTotal(subtotal)
              
              return (
                <div key={cart.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Person {cart.id}'s Cart
                  </h3>
                  
                  {cart.items.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Cart is empty</p>
                  ) : (
                    <div className="space-y-3 mb-4">
                      {cart.items.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(cart.id, item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(cart.id, item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee ({groupSize} people):</span>
                      <span className="font-semibold">${deliveryFeePerPerson.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span className="text-gray-800">Total:</span>
                      <span className="text-blue-600">${personTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Group Summary */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Group Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Group Subtotal:</span>
                  <span className="font-semibold">${groupSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className="font-semibold">${DELIVERY_FEE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-blue-400">
                  <span>Group Total:</span>
                  <span>${(groupSubtotal + DELIVERY_FEE).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

