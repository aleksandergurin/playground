import React, { PropTypes } from 'react';

import { gettext as _ } from 'gettext';

import { DebouncedInput } from '../components/DebouncedInput';
import { SelectedItems } from '../components/SelectedItems';
import { Tree } from '../components/Tree';
import { filterTree } from '../reducer';

export function TreeContainer(props) {
    const {
        tree, filterData, comparator, dataRenderer,
        selectedItems, renderSelected,
        onChange, onNodeClick, onNodeSelect, onClose,
    } = props;

    return (
        <div>
            <div className='b-zk-subscription__categories'>
                <DebouncedInput
                    placeholder={_('Найти (например: топливо, продукты)')}
                    cls='zk-textfield'
                    onChange={onChange}
                />

                <div className='b-line h-mv-20' />

                <div className='b-tree__wrapper'>
                    <Tree
                        {...filterTree(tree, filterData, comparator)}
                        dataRenderer={dataRenderer}
                        onNodeClick={onNodeClick}
                        onNodeSelect={onNodeSelect}
                    />
                </div>
            </div>

            {selectedItems.length > 0
                ? <div className='h-mt-20 h-mb-20'>{_('Выбранные категории')}:</div>
                : null
            }
            <SelectedItems
                items={selectedItems}
                renderer={renderSelected}
                onClose={onClose}
            />
        </div>
    );
}

TreeContainer.propTypes = {
    tree: PropTypes.object.isRequired,
    filterData: PropTypes.string.isRequired,
    comparator: PropTypes.func.isRequired,
    dataRenderer: PropTypes.func.isRequired,
    selectedItems: PropTypes.array.isRequired,
    renderSelected: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onNodeClick: PropTypes.func.isRequired,
    onNodeSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};
