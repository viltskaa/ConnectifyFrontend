import React from 'react';
import {Flex, Skeleton} from "antd";

export type SkeletonMessageProps = {
    variant?: "left" | "right"
};

const SkeletonMessage = ({variant="left"}: SkeletonMessageProps): React.ReactElement => {
    return (
        <Flex
            justify={variant === 'right' ? 'end' : "start"}
            className={variant === 'right' ? 'flex-row-reverse' : 'flex-row'}
            gap={"small"}
        >
            <Skeleton.Avatar shape={"square"} active className="rounded-2" />
            <Skeleton.Input active size={"default"} />
        </Flex>
    );
};

export default SkeletonMessage;