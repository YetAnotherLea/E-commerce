import { useCart } from "./useCart";
import { useUserAuth } from "./useUserAuth";

export function useAddToCart() {
  const { setCart } = useCart();
  const { user } = useUserAuth();

  return (product, quantity = 1) => {
    console.log(
      `Ajout au panier ${user ? `(utilisateur: ${user.id})` : "(invité)"}:`,
      product
    );

    if (!product || !product.ProductId) {
      console.error("Produit invalide:", product);
      return false;
    }

    if (quantity <= 0) {
      console.error("Quantité invalide:", quantity);
      return false;
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.ProductId === product.ProductId
      );

      let newCart;
      if (existingItemIndex >= 0) {
        newCart = prevCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        console.log(
          `Quantity updated ${product.ProductTitle}: ${
            prevCart[existingItemIndex].quantity
          } -> ${prevCart[existingItemIndex].quantity + quantity}`
        );
      } else {
        const newItem = {
          ...product,
          quantity: quantity,
          addedAt: new Date().toISOString(),
        };
        newCart = [...prevCart, newItem];
        console.log(`New product added: ${product.ProductTitle}`);
      }

      console.log("Cart updated:", newCart);
      return newCart;
    });

    return true;
  };
}
