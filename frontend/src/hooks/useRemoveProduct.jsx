import { useCart } from "./useCart";

export function useRemoveProduct() {
  const { setCart } = useCart();

  return (productToRemove) => {
    console.log("Removing product:", productToRemove);

    setCart((prevCart) => {
      const newCart = prevCart.filter(
        (item) => item.ProductId !== productToRemove.ProductId
      );
      console.log("Cart after removal:", newCart);
      return newCart;
    });
  };
}
