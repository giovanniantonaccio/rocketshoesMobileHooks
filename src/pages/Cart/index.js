import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import * as CartActions from '../../store/modules/cart/actions';

import { formatPrice } from '../../util/format';

import {
  Container,
  EmptyContainer,
  EmptyCart,
  EmptyText,
  ProductContainer,
  List,
  Product,
  ProductHeader,
  ProductDetails,
  ProductInfo,
  ProductImage,
  ProductTitle,
  ProductDeleteContainer,
  ProductDelete,
  ProductPrice,
  ProductFooter,
  MinusControlContainer,
  MinusControl,
  AmountControl,
  PlusControlContainer,
  PlusControl,
  FooterTotal,
  Controls,
  SubmitButton,
  SubmitButtonText,
  TotalText,
  TotalAmount,
} from './styles';

export default function Cart() {
  const cart = useSelector(state =>
    state.cart.map(product => ({
      ...product,
      subtotal: formatPrice(product.price * product.amount),
    }))
  );

  const total = useSelector(state =>
    formatPrice(
      state.cart.reduce((sumTotal, product) => {
        return sumTotal + product.price * product.amount;
      }, 0)
    )
  );

  const dispatch = useDispatch();

  function increment(product) {
    dispatch(CartActions.updateAmountRequest(product.id, product.amount + 1));
  }

  function decrement(product) {
    dispatch(CartActions.updateAmountRequest(product.id, product.amount - 1));
  }

  return (
    <Container>
      {cart.length === 0 ? (
        <EmptyContainer>
          <EmptyCart />
          <EmptyText>Seu carrinho está vazio</EmptyText>
        </EmptyContainer>
      ) : (
        <ProductContainer>
          <List
            data={cart}
            keyExtractor={product => String(product.id)}
            renderItem={({ item }) => (
              <Product>
                <ProductHeader>
                  <ProductDetails>
                    <ProductImage source={{ uri: item.image }} />
                    <ProductInfo>
                      <ProductTitle>{item.title}</ProductTitle>
                      <ProductPrice>{formatPrice(item.price)}</ProductPrice>
                    </ProductInfo>
                  </ProductDetails>
                  <ProductDeleteContainer
                    onPress={() =>
                      dispatch(CartActions.removeFromCart(item.id))
                    }
                  >
                    <ProductDelete />
                  </ProductDeleteContainer>
                </ProductHeader>
                <ProductFooter>
                  <Controls>
                    <MinusControlContainer onPress={() => decrement(item)}>
                      <MinusControl />
                    </MinusControlContainer>
                    <AmountControl>{item.amount}</AmountControl>
                    <PlusControlContainer onPress={() => increment(item)}>
                      <PlusControl />
                    </PlusControlContainer>
                  </Controls>
                  <FooterTotal>{formatPrice(item.subtotal)}</FooterTotal>
                </ProductFooter>
              </Product>
            )}
          />
          <TotalText>Total</TotalText>
          <TotalAmount>{total}</TotalAmount>
          <SubmitButton>
            <SubmitButtonText>Finalizar Pedido</SubmitButtonText>
          </SubmitButton>
        </ProductContainer>
      )}
    </Container>
  );
}
