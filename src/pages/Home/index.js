import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import * as CartActions from '../../store/modules/cart/actions';

import { formatPrice } from '../../util/format';
import api from '../../services/api';

import {
  List,
  Container,
  ProductImage,
  ProductTitle,
  ProductPrice,
  AddToCartButton,
  ProductAmount,
  ProductAmountIcon,
  ProductAmountText,
  ButtonText,
} from './styles';

export default function Home() {
  const [products, setProducts] = useState([]);

  const amount = useSelector(state =>
    state.cart.reduce((sumAmount, product) => {
      sumAmount[product.id] = product.amount;
      return sumAmount;
    }, {})
  );

  const dispatch = useDispatch();

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (err) {
        console.tron.error(err);
      }
    }

    loadProducts();
  }, []);

  return (
    <SafeAreaView>
      <List
        data={products}
        keyExtractor={product => String(product.id)}
        renderItem={({ item }) => (
          <Container>
            <ProductImage source={{ uri: item.image }} />
            <ProductTitle>{item.title}</ProductTitle>
            <ProductPrice>{formatPrice(item.price)}</ProductPrice>
            <AddToCartButton
              onPress={() => dispatch(CartActions.addToCartRequest(item.id))}
            >
              <ProductAmount>
                <ProductAmountIcon />
                <ProductAmountText>{amount[item.id] || 0}</ProductAmountText>
              </ProductAmount>
              <ButtonText>Adicionar</ButtonText>
            </AddToCartButton>
          </Container>
        )}
      />
    </SafeAreaView>
  );
}
