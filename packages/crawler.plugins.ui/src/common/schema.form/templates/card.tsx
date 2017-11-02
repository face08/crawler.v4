import React from "react";
import { Card } from "antd";

import { SchemaFormItemProps } from "fx-schema-form-antd";

export interface AntdCardTempProps extends SchemaFormItemProps {
    tempKey: string;
}

export class AntdCardTemp extends React.Component<AntdCardTempProps, any> {
    public render(): JSX.Element {
        const { children, globalOptions, tempKey, uiSchemaOptions, mergeSchema, arrayItems, meta } = this.props;
        const tempOptions = Object.assign({}, globalOptions[tempKey] || {}, uiSchemaOptions[tempKey] || {});
        const { uiSchema, title } = mergeSchema;
        let { dirty, isValid, errorText = "" } = meta;

        return (
            <Card style={{
                marginBottom: "24px"
            }} {...tempOptions} title={title || uiSchema.title}
                extra={arrayItems.constructor === Function ? arrayItems() : arrayItems} bodyStyle={{
                    "display": meta.isShow === false ? "none" : "block"
                }}>
                {children}
                {!isValid ? errorText : ""}
            </Card>
        );
    }
}
