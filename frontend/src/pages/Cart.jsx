import { Link } from "react-router-dom";
import { useCart, useRemoveProduct, useUpdateCartQuantity } from "../hooks";
import { bin } from "../assets";
import "../styles/Cart.css";

function Cart() {
  const { cart } = useCart();
  const updateQuantity = useUpdateCartQuantity();
  const removeProduct = useRemoveProduct();

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-page-container">
        <h2>Votre Panier</h2>
        <p>Votre panier est vide.</p>
      </div>
    );
  }

  const totalPrice = cart.reduce(
    (total, item) => total + item.Price * item.quantity,
    0,
  );

  const handleRemoveProduct = (item) => {
    console.log(`Removing:`, item);
    removeProduct(item);
  };

  const handleDecreaseQuantity = (item) => {
    console.log("Decreasing:", item);
    if (item.quantity > 1) {
      updateQuantity(item, item.quantity - 1);
    } else {
      handleRemoveProduct(item);
    }
  };

  const handleIncreaseQuantity = (item) => {
    console.log("Increasing:", item);
    updateQuantity(item, item.quantity + 1);
  };

  return (
    <div className="cart-page-container">
      <div className="cart-header">
        <h2>Votre Panier</h2>
        <h3>
          <Link to="/catalog">Continuer mes achats</Link>
        </h3>
      </div>

      <div className="cart-info-container">
        <table className="cart-items-container">
          <thead className="cart-table-titles">
            <tr>
              <th>PRODUIT</th>
              <th className="cart-title-quantity">QUANTITÉ</th>
              <th>TOTAL</th>
            </tr>
          </thead>

          <tbody>
            {cart.map((item) => (
              <tr key={item.ProductId}>
                <td className="cart-item-info">
                  <img
                    loading="lazy"
                    src={item.ImageURL}
                    alt={item.ProductTitle}
                    className="cart-item-img"
                  />
                  <div>
                    <h4>
                      <Link to={`/product/${item.ProductId}`}>
                        {item.ProductTitle}
                      </Link>
                    </h4>
                    <p>${item.Price}</p>
                  </div>
                </td>
                <td className="cart-quantity-controls">
                  <div className="cart-controls-container">
                    <div className="cart-increase-dicrease">
                      <button
                        className="dicrease"
                        onClick={() => handleDecreaseQuantity(item)}
                      >
                        &#45;
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="increase"
                        onClick={() => handleIncreaseQuantity(item)}
                      >
                        &#43;
                      </button>
                    </div>
                    <a
                      className="cart-delete-btn"
                      onClick={() => handleRemoveProduct(item)}
                    >
                      <img loading="lazy" src={bin} />
                    </a>
                  </div>
                </td>
                <td className="item-details">
                  <h4>
                    <strong>${(item.Price * item.quantity).toFixed(2)}</strong>
                  </h4>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cart-summary">
          <h3>
            <strong>Total estimé : ${totalPrice.toFixed(2)}</strong>
          </h3>
          <p>
            Taxes incluses.
            <br /> Remises et frais de port calculés lors du paiement.
          </p>
          <Link to="/checkout">
            <button className="checkout-btn">Commander</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
