import { useState, useEffect, useContext } from "react";
import { CartContext } from "../contexts";
import { UserAuthContext } from "../contexts";

export const CartProvider = ({ children }) => {
  const userContext = useContext(UserAuthContext);
  const user = userContext?.user;

  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCartKey = (userId = null) => {
    return userId ? `cart_user_${userId}` : "cart_guest";
  };

  const loadCartFromStorage = (userId = null) => {
    try {
      const cartKey = getCartKey(userId);
      const savedCart = localStorage.getItem(cartKey);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
      return [];
    }
  };

  const saveCartToStorage = (cartData, userId = null) => {
    try {
      const cartKey = getCartKey(userId);
      localStorage.setItem(cartKey, JSON.stringify(cartData));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier:", error);
    }
  };

  const mergeCart = (guestCart, userCart) => {
    const merged = [...userCart];

    guestCart.forEach((guestItem) => {
      const existingIndex = merged.findIndex(
        (item) => item.ProductId === guestItem.ProductId
      );

      if (existingIndex >= 0) {
        merged[existingIndex] = {
          ...merged[existingIndex],
          quantity: merged[existingIndex].quantity + guestItem.quantity,
        };
      } else {
        merged.push(guestItem);
      }
    });

    return merged;
  };

  useEffect(() => {
    const initialCart = loadCartFromStorage();
    setCart(initialCart);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      const guestCart = cart;
      const userCart = loadCartFromStorage(user.id);

      if (guestCart.length > 0 && userCart.length > 0) {
        const mergedCart = mergeCart(guestCart, userCart);
        setCart(mergedCart);
        saveCartToStorage(mergedCart, user.id);
        localStorage.removeItem(getCartKey());
      } else if (guestCart.length > 0) {
        setCart(guestCart);
        saveCartToStorage(guestCart, user.id);
        localStorage.removeItem(getCartKey());
      } else {
        setCart(userCart);
      }
    } else {
      const guestCart = loadCartFromStorage();
      setCart(guestCart);
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveCartToStorage(cart, user?.id);
    }
  }, [cart, user, isLoading]);

  const clearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(getCartKey(user.id));
    } else {
      localStorage.removeItem(getCartKey());
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.Price * item.quantity, 0);
  };

  console.log(`Cart ${user ? `user ${user.id}` : "not connected"}:`, cart);

  if (isLoading) {
    return <div>Chargement du panier...</div>;
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
