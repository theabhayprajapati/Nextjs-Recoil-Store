import Head from 'next/head'
import React from 'react'
import { useState } from 'react/cjs/react.production.min'
import {
  atom,
  RecoilRoot,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil'

const inventory = {
  a: { name: 'Yerba Mate', price: 10 },
  b: { name: 'Coffee', price: 15 },
  c: { name: 'Tea', price: 7.5 },
}
const cartstate = atom({
  key: 'cartstate',
  default: {},
})

const MainApp = () => {
  return (
    <RecoilRoot>
      <Index />
      <Cart />
    </RecoilRoot>
  )
}
export default MainApp

const Index = () => {
  const [newcarstate, newsetcarstate] = useRecoilState(cartstate)
  console.log('thsi atom', newcarstate)
  return (
    <div>
      <Head>
        <title>Learn Recoil</title>
      </Head>
      <div>learn recoil</div>
      {Object.entries(inventory).map(([id, { name, price }]) => {
        return (
          <div>
            <h1>{name}:</h1>
            <h1>{price}</h1>
            <button
              onClick={() => {
                newsetcarstate({
                  ...newcarstate,
                  [id]: (newcarstate[id] || 0) + 1,
                })
              }}
            >
              Add
            </button>
            {newcarstate[id] ? (
              <button
                onClick={() => {
                  const copy = { ...newcarstate }
                  if (copy[id] === 1) {
                    delete copy[id]
                    newsetcarstate(copy)
                  } else {
                    newsetcarstate({ ...copy, [id]: copy[id] - 1 })
                  }
                }}
              >
                Remove
              </button>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
function Cart() {
  return (
    <div>
      <h2>Cart</h2>
      <CartItems />
      <Shipping />
      <Totals />
    </div>
  )
}

function CartItems() {
  const cart = useRecoilValue(cartstate)
  console.log('form here', cart)
  if (Object.keys(cart).length === 0) {
    return <p>No Items</p>
  }

  return (
    <ul>
      {Object.entries(cart).map(([id, quantity]) => (
        <li key={id}>
          {inventory[id].name} x {quantity}
        </li>
      ))}
    </ul>
  )
}

const Shipping = () => {
  return <div></div>
}

const totalState = selector({
  key: 'totalsState',
  get: ({ get }) => {
    const cart = get(cartstate)
    // const shipping = get(shippingState)
    const subTotal = Object.entries(cart).reduce(
      (acc, [id, quantity]) => acc + inventory[id].price * quantity,
      0,
    )
    // const shippingTotal = destinations[shipping]

    return {
      subTotal,
      // shipping: shippingTotal,
      total: subTotal,
    }
  },
})

function Totals() {
  const totals = useRecoilValue(totalState)

  return (
    <div>
      <h2>Totals</h2>
      <p>Subtotal: ${totals.subTotal.toFixed(2)}</p>
      {/* <p>Shipping: ${totals.shipping.toFixed(2)}</p> */}
      <p>
        <strong>Totals: ${totals.total.toFixed(2)}</strong>
      </p>
    </div>
  )
}
