import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
    title: String;
};

const RountButton = ({ title }: Props): React.JSX.Element => (
    <TouchableOpacity>
        <Text>{title}</Text>
    </TouchableOpacity>
);

export default RountButton;