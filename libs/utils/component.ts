import { getComponentMetadata } from "./decorator";
import { Html } from "./html";

export abstract class Component<T extends HTMLElement = HTMLElement> {
    protected _root: Html<T>;
    protected _mounted: boolean = false;
    protected _slots: Map<string, Html> = new Map();

    constructor(tag: keyof HTMLElementTagNameMap = "div") {
        this._root = new Html(tag) as Html<T>;
        this.initializeSlots();
    }

    private initializeSlots(): void {
        const metadata = getComponentMetadata(this.constructor);

        metadata.placeholders.forEach((placeholderMeta, name) => {
            const slot = new Html("div")
                .classOn(`slot-${name}`)
                .attr("data-slot", name);

            if (placeholderMeta.defaultContent) {
                if (typeof placeholderMeta.defaultContent === "string") {
                    slot.text(placeholderMeta.defaultContent);
                } else {
                    slot.append(placeholderMeta.defaultContent);
                }
            }

            this._slots.set(name, slot);
        });
    }

    protected abstract template(): Html;

    protected onMount?(): void;

    protected onPropChange?(
        propName: string,
        newValue: any,
        oldValue: any,
    ): void;

    protected onPlaceholderChange?(slotName: string, newContent: Html): void;

    public mount(): Html<T> {
        if (this._mounted) {
            return this._root;
        }

        this._root = this.template() as Html<T>;
        this._mounted = true;

        this._slots.forEach((slotElement, name) => {
            const slotTarget = this._root.qs(`[data-slot="${name}"]`);
            if (slotTarget) {
                slotTarget.append(slotElement);
            }
        });

        if (this.onMount) {
            this.onMount();
        }

        return this._root;
    }

    public setSlot(name: string, content: Html | string): this {
        const slot = this._slots.get(name);
        if (!slot) {
            console.warn(`Slot "${name}" not found`);
            return this;
        }

        slot.clear();
        if (typeof content === "string") {
            slot.text(content);
        } else {
            slot.append(content);
        }

        return this;
    }

    public getSlot(name: string): Html | undefined {
        return this._slots.get(name);
    }

    public setProps(props: Record<string, any>): this {
        Object.entries(props).forEach(([key, value]) => {
            if (key in this) {
                (this as any)[key] = value;
            }
        });
        return this;
    }

    public getRoot(): Html<T> {
        return this._root;
    }

    public destroy(): void {
        this._root.cleanup();
        this._mounted = false;
    }
}
