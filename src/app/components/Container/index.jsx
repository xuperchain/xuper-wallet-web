/**
 * @file (index)
 */

import React from 'react';
import clsx from 'clsx';

import styles from './styles.less';

export default props => {
    return (
        <div className={clsx(styles.frame, props.className)}>
            {props.children}
        </div>
    )
}
