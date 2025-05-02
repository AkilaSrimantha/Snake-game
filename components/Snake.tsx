import React from 'react';
import { View } from 'react-native';
import { colors } from '../constants';

type SnakeProps = {
  snake: Array<{ x: number, y: number }>;
};

const Snake: React.FC<SnakeProps> = ({ snake }) => {
  return (
    <>
      {snake.map((segment, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            left: segment.x * 20,
            top: segment.y * 20,
            width: 20,
            height: 20,
            backgroundColor: colors.snake,
          }}
        />
      ))}
    </>
  );
};

export default Snake;
