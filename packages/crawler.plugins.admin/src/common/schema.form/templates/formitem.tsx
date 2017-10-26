import React from "react";
import { Form, Input, Row, Col } from "antd";
import { FormItemProps } from "antd/lib/form/FormItem";

import { SchemaFormItemProps } from "fx-schema-form-antd";

export interface AntdFormItemTempProps extends SchemaFormItemProps {
    tempKey: string;
}

export class AntdFormItemTemp extends React.Component<AntdFormItemTempProps, any> {
    public render(): JSX.Element {
        const { children, arrayIndex, arrayItems, mergeSchema, globalOptions = {}, tempKey, uiSchemaOptions,
            meta = { dirty: false, isValid: true, isLoading: false }
        } = this.props;
        const tempOptions = Object.assign({}, globalOptions[tempKey] || {}, uiSchemaOptions[tempKey] || {});
        const { hasFeedback = false } = tempOptions;
        let props: FormItemProps = {};
        let { dirty, isValid, errorText = "", isLoading = false } = meta;

        if (dirty) {
            props.validateStatus = !isValid ? "error" : "success";
        }

        if (isLoading) {
            props.validateStatus = "validating";
        }

        return (
            <Form.Item
                required={mergeSchema.isRequired}
                label={mergeSchema.title || [].concat(mergeSchema.keys).pop()}
                extra={mergeSchema.description}
                help={isValid ? "" : errorText}
                hasFeedback={dirty && hasFeedback}
                {...props}
                {...tempOptions}>
                <Row type="flex">
                    <Col span={20}>{children}</Col>
                    <Col offset={1} span={3}>{arrayItems && arrayItems()}</Col>
                </Row>
            </Form.Item>
        );
    }
}
