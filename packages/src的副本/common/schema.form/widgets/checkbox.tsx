import React, { SyntheticEvent } from "react";
import { Checkbox } from "antd";
import { CheckboxProps } from "antd/lib/checkbox/Checkbox";

import { SchemaFormItemProps } from "fx-schema-form-antd";


export interface AntdCheckBoxProps extends SchemaFormItemProps {
}

export class AntdCheckboxWidget extends React.Component<AntdCheckBoxProps, any> {
    public render(): JSX.Element {
        const { mergeSchema, arrayIndex, globalOptions, uiSchemaOptions, meta, validate, updateItemData } = this.props;
        const { checkbox = {} } = uiSchemaOptions.widget || {};
        const { checkbox: checkboxDefault = {} } = globalOptions.widget || {};
        const { uiSchema = {}, keys } = mergeSchema;
        const { readonly = false } = uiSchema as any;

        return (
            <Checkbox onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                updateItemData((e.target as any).checked);
                validate((e.target as any).checked);
            }}
                disabled={readonly}
                {...checkbox}
                {...checkboxDefault}
                {...this.setDefaultProps() }
            ></Checkbox>
        );
    }

    private setDefaultProps(): CheckboxProps {
        const { mergeSchema } = this.props;
        const props: CheckboxProps = {};

        if (this.props.formItemData !== undefined) {
            props.checked = this.props.formItemData;
        } else {
            props.defaultChecked = mergeSchema.default;
        }

        return props;
    }
}
