import React, { SyntheticEvent } from "react";
import { Input, Icon } from "antd";
import { InputProps } from "antd/lib/input/Input";

import { SchemaFormItemProps } from "fx-schema-form-antd";

export interface AntdInputWidgetProps extends SchemaFormItemProps {
}

export class AntdInputWidget extends React.Component<AntdInputWidgetProps, any> {

    public render(): JSX.Element {
        const { mergeSchema, globalOptions, uiSchemaOptions, validate, updateItemData, formItemData } = this.props;
        const { input = {} } = uiSchemaOptions.widget || {};
        const { input: inputDefault = {} } = globalOptions.widget || {};
        const { uiSchema = {}, keys } = mergeSchema;
        const { readonly = false } = uiSchema as any;

        return (
            <Input
                onBlur={() => {
                    validate(formItemData);
                }}
                onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                    updateItemData(e.currentTarget.value);
                }}
                disabled={readonly}
                placeholder={mergeSchema.title}
                {...input}
                {...inputDefault}
                {...this.setDefaultProps() }>
            </Input>
        );
    }

    private setDefaultProps(): InputProps {
        const { mergeSchema } = this.props;
        const props: InputProps = {};

        if (this.props.formItemData !== undefined) {
            props.value = this.props.formItemData;
        } else {
            // props.defaultValue = mergeSchema.default;
            props.value = "";
        }

        return props;
    }
}
