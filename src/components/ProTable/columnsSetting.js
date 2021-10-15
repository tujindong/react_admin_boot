import { Popover, Checkbox, Tree } from "antd";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SettingOutlined } from '@ant-design/icons'
const TitleDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
`;

const ColumnsSetting = (props) => {
    // /约定/ 此处应该 只有columns最后operate项不可 编辑
    props.columns.forEach((item) => {
        item.key = item.dataIndex || "operate";
        item.disabled = !item.dataIndex;
    });
    
    const allCheckedKeys = props.columns.map((item) => item.dataIndex).filter((item) => !!item) || [];
    const [checkedKeys, setCheckedKeys] = useState(allCheckedKeys);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);

    useEffect(() => {
        setIndeterminate(checkedKeys.length < allCheckedKeys.length);
        setIsCheckedAll(checkedKeys.length === allCheckedKeys.length);
    }, [checkedKeys]); // eslint-disable-line

    return (
        <Popover
            arrowPointAtCenter
            title={
                <TitleDiv>
                    <Checkbox
                        indeterminate={indeterminate}
                        checked={isCheckedAll}
                        onChange={(e) => {
                            let selectKeys = [];
                            if (!isCheckedAll) {
                                selectKeys = allCheckedKeys;
                                setIsCheckedAll(true);
                            } else {
                                selectKeys = [];
                                setIndeterminate(false);
                            }
                            setCheckedKeys(selectKeys);
                            props.columnsChange(selectKeys);
                        }}
                    >
                        列展示
                    </Checkbox>
                    <span 
                        style={{ color: '#1890ff' }}
                        onClick={() => {
                            setCheckedKeys(allCheckedKeys);
                            props.columnsChange(allCheckedKeys);
                        }}
                    >
                        重置
                    </span>
                </TitleDiv>
            }
            trigger="click"
            placement="bottomRight"
            content={
                <div style={{ maxHeight: "300px", overflow: "auto" }}>
                    <Tree
                        itemHeight={24}
                        draggable={false}
                        checkable={true}
                        onDrop={(info) => {
                            // 功能为 优化的，较复杂 暂时没有写
                            // const dropKey = info.node.key; // 目标
                            // const dragKey = info.dragNode.key; // 拖拽
                            // const { dropPosition, dropToGap } = info;
                            // const position = dropPosition === -1 || !dropToGap ? dropPosition + 1 : dropPosition;
                            // console.log('------onDrop', info, dragKey, dropKey, position)
                            // move(dragKey, dropKey, position);
                        }}
                        blockNode
                        onCheck={(rowKeySelection) => {
                            setCheckedKeys(rowKeySelection);
                            props.columnsChange(rowKeySelection);
                        }}
                        checkedKeys={checkedKeys}
                        showLine={false}
                        switcherIcon={false}
                        height={280}
                        treeData={props.columns}
                    />
                </div>
            }
        >
            {/* ant design 3.X版本 */}
            {/* <Icon type="setting" /> */}
            <SettingOutlined />
        </Popover>
    );
};

export default ColumnsSetting;
