import { inr } from '../../lib/format'
import type { MenuItem } from '../../data/menu'
import { useCart } from '../../lib/cart'

export function ItemCard({ item }: { item: MenuItem }) {
  const { add, lines } = useCart()
  const inCart = lines.find((l) => l.id === item.id)?.qty ?? 0

  return (
    <article className="item-card">
      <div className="item-card__media">
        <img src={item.image} alt={item.name} loading="lazy" />
        {inCart > 0 && <span className="item-card__incart">{inCart} in cart</span>}
      </div>
      <div className="item-card__body">
        <h3 className="item-card__name">{item.name}</h3>
        <p className="item-card__desc">{item.desc}</p>
        <div className="item-card__foot">
          <span className="item-card__price">{inr(item.price)}</span>
          <button
            type="button"
            className="item-card__add"
            onClick={() => add({ id: item.id, name: item.name, price: item.price, image: item.image })}
          >
            Add
          </button>
        </div>
      </div>
    </article>
  )
}
