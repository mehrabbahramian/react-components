import { Component, createRef, ReactNode } from 'react';

export interface NSRepeaterProps<ItemType, ValueType> {
    createItem: (index: number, ref: React.RefObject<ItemType>, onChange: (index: number) => void, onDelete: (index: number) => void) => ReactNode;
    updateItem: (item: ItemType, index: number, value: ValueType | null) => void;
    getValue: (item: ItemType, checkError: boolean) => ValueType;
    isEmpty: (value: ValueType) => boolean;
    onItemChanged?: () => void;
    onValuesChanged?: (values: ValueType[]) => void;
}

export interface NSRepeaterState {
    items: boolean[];
}

export class NSRepeater<ItemType, ValueType> extends Component<NSRepeaterProps<ItemType, ValueType>, NSRepeaterState> {
    private Item_Refs: React.RefObject<ItemType>[] = [];
    constructor(props: NSRepeaterProps<ItemType, ValueType>) {
        super(props);
        this.state = { items: [] };
        this.getGIndex = this.getGIndex.bind(this);
        this.getIndex = this.getIndex.bind(this);
        this.addItem = this.addItem.bind(this);
        this.delItem = this.delItem.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.checkForNew = this.checkForNew.bind(this);
        this.getValues = this.getValues.bind(this);
        this.setValues = this.setValues.bind(this);
    }
    private getGIndex(index: number): number {
        if (this.state.items.length === 0)
            return 0;
        for (let i = 0; i < this.state.items.length; i++) {
            if (this.state.items[i]) {
                if (index === 0)
                    return i;
                index--;
            }
        }
        return this.state.items.length - 1;
    }
    private getIndex(gindex: number): number {
        if (gindex >= this.state.items.length)
            throw new Error("GIndex out of bound: " + gindex);
        let ans = 0;
        for (let i = 0; i <= gindex; i++) {
            if (this.state.items[i])
                ans++;
        }
        return ans;
    }
    private addItem(state: boolean = true) {
        this.Item_Refs.push(createRef<ItemType>());
        if (state) {
            let items = this.state.items;
            items.push(true);
            this.setState({ items }, () => {
                if (this.props.onItemChanged)
                    this.props.onItemChanged();
            });
        }
    }
    private delItem(index: number) {
        if (this.Item_Refs.length > 0) {
            let gindex = this.getGIndex(index);
            let items = this.state.items;
            items[gindex] = false;
            this.setState({ items }, () => {
                if (this.props.onItemChanged)
                    this.props.onItemChanged();
                this.onChange();
            });
        }
    }
    private onChange() {
        if (this.props.onValuesChanged)
            this.props.onValuesChanged(this.getValues(false));
        this.checkForNew();
    }
    private onDelete(index: number) {
        let length = this.state.items.filter(x => x).length;
        if (length - 1 !== index)
            if (length > 1)
                this.delItem(index);
    }
    private checkForNew() {
        let length = this.state.items.filter(x => x).length;
        if (length === 0)
            this.addItem();
        else {
            let last = this.Item_Refs.length - 1;
            while (!this.state.items[last])
                last--;
            let item = this.Item_Refs[last].current;
            if (item)
                if (!this.props.isEmpty(this.props.getValue(item, false)))
                    this.addItem();
        }
    }
    getValues(checkError: boolean = true): ValueType[] {
        return this.state.items.map((_, index) => {
            let item = this.Item_Refs[index].current;
            if (item) {
                let value = this.props.getValue(item, checkError);
                if (!this.props.isEmpty(value))
                    return value;
            }
            return null
        }).filter(x => x !== null) as ValueType[];
    }
    setValues(values: ValueType[]) {
        this.Item_Refs = [];
        values.forEach(() => {
            this.addItem(false);
        })
        let items = values.map(() => true);
        this.setState({ items }, () => {
            if (this.props.onItemChanged)
                this.props.onItemChanged();
            values.forEach((value, index) => {
                let item = this.Item_Refs[index].current;
                if (item)
                    this.props.updateItem(item, index, value)
            });
            this.onChange();
        });
    }
    override componentDidMount() {
        this.addItem();
    }
    override render() {
        let i = 0;
        return (
            <>
                {
                    this.Item_Refs.map((ref, index) => {
                        if (this.state.items[index])
                            return this.props.createItem(i++, ref, this.onChange, this.onDelete);
                        return <></>;
                    }
                    )
                }
            </>
        );
    }
}