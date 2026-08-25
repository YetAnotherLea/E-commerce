import { useCart } from "./useCart";

export function useUpdateCartQuantity() {
  const { setCart } = useCart();

  return (product, newQuantity) => {
    console.log(
      "Updating quantity for:",
      product,
      "New quantity:",
      newQuantity
    );

    if (newQuantity <= 0) {
      setCart((prevCart) => {
        return prevCart.filter((item) => item.ProductId !== product.ProductId);
      });
      return;
    }

    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item.ProductId === product.ProductId
          ? { ...item, quantity: newQuantity }
          : item
      );
      console.log("Cart after quantity update:", newCart);
      return newCart;
    });
  };
}
