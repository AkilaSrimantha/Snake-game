import React from 'react';
import { View } from 'react-native';
import { colors } from '../constants';

type FoodProps = {
  food: { x: number, y: number };
};

const Food: React.FC<FoodProps> = ({ food }) => {
  return (
    <View
      style={{
        position: 'absolute',
        left: food.x * 20,
        top: food.y * 20,
        width: 20,
        height: 20,
        backgroundColor: colors.food,
      }}
    />
  );
};

export default Food;
