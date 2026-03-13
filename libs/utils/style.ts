import {
	ThemeBorderRadius,
	ThemeColors,
	ThemeManager,
	ThemeTransitions,
	ThemeTypography,
	ThemeZIndex,
} from "./theme";

type CSSValue = string | number;
type CSSUnit =
	| "px"
	| "em"
	| "rem"
	| "%"
	| "vh"
	| "vw"
	| "vmin"
	| "vmax"
	| "ch"
	| "ex"
	| "deg";

interface StyleRules {
	[selector: string]: Record<string, string>;
}

interface PendingStyle {
	css: string;
	priority: number;
}

export class StyleContext {
	private static instance: StyleContext | null = null;
	private styleElement: HTMLStyleElement | null = null;
	private pending: PendingStyle[] = [];
	private flushed = false;

	private constructor() {}

	static getInstance(): StyleContext {
		if (!StyleContext.instance) {
			StyleContext.instance = new StyleContext();
		}
		return StyleContext.instance;
	}

	register(css: string, priority: number = 0): this {
		this.pending.push({ css, priority });
		if (!this.flushed) {
			this.flushed = true;
			Promise.resolve().then(() => {
				this.flush();
				this.flushed = false;
			});
		}
		return this;
	}

	flush(): void {
		if (this.pending.length === 0) return;

		this.pending.sort((a, b) => a.priority - b.priority);

		const css = this.pending.map((p) => p.css).join("\n");
		this.pending = [];

		this.ensureStyleElement();
		this.styleElement!.textContent += css;
	}

	private ensureStyleElement(): void {
		if (!this.styleElement) {
			this.styleElement = document.createElement("style");
			this.styleElement.setAttribute("data-style-context", "true");
			document.head.appendChild(this.styleElement);
		}
	}

	reset(): void {
		this.styleElement?.remove();
		this.styleElement = null;
		this.pending = [];
		this.flushed = false;
	}

	static reset(): void {
		StyleContext.getInstance().reset();
	}
}

export class Style {
	private selector: string;
	private rules: Record<string, string> = {};
	private mediaQueries: Map<string, Record<string, string>> = new Map();
	private pseudoStates: Map<string, Record<string, string>> = new Map();
	private children: Map<string, Record<string, string>> = new Map();
	private static globalStyles: StyleRules = {};
	private static styleElement: HTMLStyleElement | null = null;
	private themeManager: ThemeManager | null = null;
	private _priority: number = 0;
	private _useContext = false;

	constructor(selector: string, theme?: ThemeManager | null) {
		this.selector = selector;
		this.themeManager = theme || null;
	}

	private resolveVariables(value: string): string {
		if (!this.hasTheme()) return value;

		const variablePattern = /\$([a-zA-Z0-9_.-]+)\$/g;

		return value.replace(variablePattern, (match, varName) => {
			try {
				const colorValue = this.themeManager!.color(varName);
				if (colorValue && colorValue !== varName) {
					return colorValue;
				}
			} catch {}

			const radiusValue = this.themeManager!.borderRadius[varName];
			if (radiusValue !== undefined) {
				return `${radiusValue}px`;
			}

			const customValue = this.themeManager!.custom(varName);
			if (customValue !== undefined) {
				return customValue.toString();
			}

			console.warn(`Variable "${varName}" not found in theme`);
			return match;
		});
	}

	// QUEUE
	priority(level: number): this {
		this._priority = level;
		this._useContext = true;
		return this;
	}

	// THEME MANAGEMENT
	withTheme(theme: ThemeManager): this {
		this.themeManager = theme;
		return this;
	}

	getTheme(): ThemeManager | null {
		return this.themeManager;
	}

	private hasTheme(): boolean {
		return this.themeManager !== null;
	}

	themeColor(key: keyof ThemeColors): this {
		if (!this.hasTheme()) {
			console.warn("No theme attached to this Style instance");
			return this;
		}
		return this.color(this.themeManager!.color(key));
	}

	themeBgColor(key: keyof ThemeColors): this {
		if (!this.hasTheme()) {
			console.warn("No theme attached to this Style instance");
			return this;
		}
		return this.bgColor(this.themeManager!.color(key));
	}

	themeBorderColor(key: keyof ThemeColors): this {
		if (!this.hasTheme()) {
			console.warn("No theme attached to this Style instance");
			return this;
		}
		return this.borderColor(this.themeManager!.color(key));
	}

	themeRadius(key: keyof ThemeBorderRadius): this {
		if (!this.hasTheme()) {
			console.warn("No theme attached to this Style instance");
			return this;
		}
		return this.borderRadius(this.themeManager!.radius(key));
	}

	themeFontSize(key: keyof ThemeTypography["fontSize"]): this {
		if (!this.hasTheme()) {
			console.warn("No theme attached to this Style instance");
			return this;
		}
		return this.addRule("font-size", this.themeManager!.fontSize(key));
	}

	themeFontWeight(key: keyof ThemeTypography["fontWeight"]): this {
		if (!this.hasTheme()) {
			console.warn("No theme attached to this Style instance");
			return this;
		}
		return this.fontWeight(this.themeManager!.fontWeight(key) as any);
	}

	themeTransition(
		property: string = "all",
		durationKey?: keyof ThemeTransitions["duration"],
		timingKey?: keyof ThemeTransitions["timing"],
	): this {
		if (!this.hasTheme()) {
			console.warn("No theme attached to this Style instance");
			return this;
		}
		return this.addRule(
			"transition",
			this.themeManager!.transition(property, durationKey, timingKey),
		);
	}
	themeZIndex(key: keyof ThemeZIndex): this {
		if (!this.hasTheme()) {
			console.warn("No theme attached to this Style instance");
			return this;
		}
		return this.zIndex(this.themeManager!.z(key));
	}

	// HELPER
	private addUnit(value: CSSValue, defaultUnit: CSSUnit = "px"): string {
		if (typeof value === "number") {
			return value === 0 ? "0" : `${value}${defaultUnit}`;
		}
		return value;
	}

	private addRule(property: string, value: CSSValue, unit?: CSSUnit): this {
		let finalValue = unit ? this.addUnit(value, unit) : value.toString();

		if (this.hasTheme()) {
			finalValue = this.resolveVariables(finalValue);
		}

		this.rules[property] = finalValue;
		return this;
	}

	// DISPLAY & LAYOUT
	display(
		value:
			| "block"
			| "inline"
			| "inline-block"
			| "flex"
			| "inline-flex"
			| "grid"
			| "inline-grid"
			| "none"
			| string,
	): this {
		return this.addRule("display", value);
	}

	flex(grow?: number, shrink?: number, basis?: CSSValue): this {
		if (grow !== undefined && shrink !== undefined && basis !== undefined) {
			return this.addRule(
				"flex",
				`${grow} ${shrink} ${this.addUnit(basis)}`,
			);
		}
		if (grow !== undefined) {
			return this.addRule("flex", grow.toString());
		}
		return this.addRule("display", "flex");
	}

	flexDirection(
		value: "row" | "row-reverse" | "column" | "column-reverse",
	): this {
		return this.addRule("flex-direction", value);
	}

	flexWrap(value: "nowrap" | "wrap" | "wrap-reverse"): this {
		return this.addRule("flex-wrap", value);
	}

	justifyContent(
		value:
			| "flex-start"
			| "flex-end"
			| "center"
			| "space-between"
			| "space-around"
			| "space-evenly",
	): this {
		return this.addRule("justify-content", value);
	}

	alignItems(
		value: "flex-start" | "flex-end" | "center" | "baseline" | "stretch",
	): this {
		return this.addRule("align-items", value);
	}

	alignContent(
		value:
			| "flex-start"
			| "flex-end"
			| "center"
			| "space-between"
			| "space-around"
			| "stretch",
	): this {
		return this.addRule("align-content", value);
	}

	alignSelf(
		value:
			| "auto"
			| "flex-start"
			| "flex-end"
			| "center"
			| "baseline"
			| "stretch",
	): this {
		return this.addRule("align-self", value);
	}

	gap(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("gap", value, unit || "px");
	}

	grid(columns?: string, rows?: string): this {
		this.display("grid");
		if (columns) this.addRule("grid-template-columns", columns);
		if (rows) this.addRule("grid-template-rows", rows);
		return this;
	}

	gridTemplateColumns(value: string): this {
		return this.addRule("grid-template-columns", value);
	}

	gridTemplateRows(value: string): this {
		return this.addRule("grid-template-rows", value);
	}

	gridColumn(value: string): this {
		return this.addRule("grid-column", value);
	}

	gridRow(value: string): this {
		return this.addRule("grid-row", value);
	}

	// POSITION
	position(
		value: "static" | "relative" | "absolute" | "fixed" | "sticky",
	): this {
		return this.addRule("position", value);
	}

	top(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("top", value, unit || "px");
	}

	right(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("right", value, unit || "px");
	}

	bottom(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("bottom", value, unit || "px");
	}

	left(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("left", value, unit || "px");
	}

	inset(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("inset", value, unit || "px");
	}

	zIndex(value: number): this {
		return this.addRule("z-index", value);
	}

	// SPACING - Padding
	p(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("padding", value, unit || "px");
	}

	pi(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("padding-inline", value, unit || "px");
	}

	pt(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("padding-top", value, unit || "px");
	}

	pr(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("padding-right", value, unit || "px");
	}

	pb(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("padding-bottom", value, unit || "px");
	}

	pl(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("padding-left", value, unit || "px");
	}

	px(value: CSSValue, unit?: CSSUnit): this {
		return this.pt(value, unit).pb(value, unit);
	}

	py(value: CSSValue, unit?: CSSUnit): this {
		return this.pl(value, unit).pr(value, unit);
	}

	padding(
		top: CSSValue,
		right?: CSSValue,
		bottom?: CSSValue,
		left?: CSSValue,
		unit?: CSSUnit,
	): this {
		const u = unit || "px";
		if (right === undefined) {
			return this.p(top, u);
		}
		if (bottom === undefined) {
			return this.addRule(
				"padding",
				`${this.addUnit(top, u)} ${this.addUnit(right, u)}`,
			);
		}
		if (left === undefined) {
			return this.addRule(
				"padding",
				`${this.addUnit(top, u)} ${this.addUnit(right, u)} ${this.addUnit(bottom, u)}`,
			);
		}
		return this.addRule(
			"padding",
			`${this.addUnit(top, u)} ${this.addUnit(right, u)} ${this.addUnit(bottom, u)} ${this.addUnit(left, u)}`,
		);
	}

	// SPACING - Margin
	m(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("margin", value, unit || "px");
	}

	mt(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("margin-top", value, unit || "px");
	}

	mr(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("margin-right", value, unit || "px");
	}

	mb(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("margin-bottom", value, unit || "px");
	}

	ml(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("margin-left", value, unit || "px");
	}

	mx(value: CSSValue, unit?: CSSUnit): this {
		return this.mt(value, unit).mb(value, unit);
	}

	my(value: CSSValue, unit?: CSSUnit): this {
		return this.ml(value, unit).mr(value, unit);
	}

	margin(
		top: CSSValue,
		right?: CSSValue,
		bottom?: CSSValue,
		left?: CSSValue,
		unit?: CSSUnit,
	): this {
		const u = unit || "px";
		if (right === undefined) {
			return this.m(top, u);
		}
		if (bottom === undefined) {
			return this.addRule(
				"margin",
				`${this.addUnit(top, u)} ${this.addUnit(right, u)}`,
			);
		}
		if (left === undefined) {
			return this.addRule(
				"margin",
				`${this.addUnit(top, u)} ${this.addUnit(right, u)} ${this.addUnit(bottom, u)}`,
			);
		}
		return this.addRule(
			"margin",
			`${this.addUnit(top, u)} ${this.addUnit(right, u)} ${this.addUnit(bottom, u)} ${this.addUnit(left, u)}`,
		);
	}

	// SIZE
	w(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("width", value, unit || "px");
	}

	h(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("height", value, unit || "px");
	}

	minW(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("min-width", value, unit || "px");
	}

	minH(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("min-height", value, unit || "px");
	}

	maxW(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("max-width", value, unit || "px");
	}

	maxH(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("max-height", value, unit || "px");
	}

	size(width: CSSValue, height?: CSSValue, unit?: CSSUnit): this {
		this.w(width, unit);
		if (height !== undefined) {
			this.h(height, unit);
		} else {
			this.h(width, unit);
		}
		return this;
	}

	// TYPOGRAPHY
	fontSize(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("font-size", value, unit || "px");
	}

	fontWeight(
		value:
			| 100
			| 200
			| 300
			| 400
			| 500
			| 600
			| 700
			| 800
			| 900
			| "normal"
			| "bold"
			| "bolder"
			| "lighter",
	): this {
		return this.addRule("font-weight", value);
	}

	fontFamily(value: string): this {
		return this.addRule("font-family", value);
	}

	lineHeight(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule(
			"line-height",
			typeof value === "number" && !unit ? value.toString() : value,
			unit,
		);
	}

	letterSpacing(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("letter-spacing", value, unit || "px");
	}

	textAlign(value: "left" | "right" | "center" | "justify"): this {
		return this.addRule("text-align", value);
	}

	textDecoration(value: string): this {
		return this.addRule("text-decoration", value);
	}

	textTransform(
		value: "none" | "capitalize" | "uppercase" | "lowercase",
	): this {
		return this.addRule("text-transform", value);
	}

	whiteSpace(
		value: "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line",
	): this {
		return this.addRule("white-space", value);
	}

	wordBreak(value: "normal" | "break-all" | "keep-all" | "break-word"): this {
		return this.addRule("word-break", value);
	}

	// COLORS
	color(value: string): this {
		return this.addRule("color", value);
	}

	bg(value: string): this {
		return this.addRule("background", value);
	}

	bgColor(value: string): this {
		return this.addRule("background-color", value);
	}

	bgImage(value: string): this {
		return this.addRule("background-image", value);
	}

	bgSize(value: string): this {
		return this.addRule("background-size", value);
	}

	bgPosition(value: string): this {
		return this.addRule("background-position", value);
	}

	bgRepeat(value: "repeat" | "repeat-x" | "repeat-y" | "no-repeat"): this {
		return this.addRule("background-repeat", value);
	}

	gradient(direction: string, ...colors: string[]): this {
		return this.addRule(
			"background",
			`linear-gradient(${direction}, ${colors.join(", ")})`,
		);
	}

	// BORDER
	border(width: CSSValue, style: string, color: string): this {
		return this.addRule(
			"border",
			`${this.addUnit(width, "px")} ${style} ${color}`,
		);
	}

	borderWidth(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("border-width", value, unit || "px");
	}

	borderStyle(
		value: "none" | "solid" | "dashed" | "dotted" | "double",
	): this {
		return this.addRule("border-style", value);
	}

	borderColor(value: string): this {
		return this.addRule("border-color", value);
	}

	borderRadius(value: CSSValue, unit?: CSSUnit): this {
		return this.addRule("border-radius", value, unit || "px");
	}

	rounded(value: CSSValue = 4, unit?: CSSUnit): this {
		return this.borderRadius(value, unit);
	}

	roundedFull(): this {
		return this.borderRadius(9999, "px");
	}

	// EFFECTS
	opacity(value: number): this {
		return this.addRule("opacity", value);
	}

	boxShadow(value: string): this {
		return this.addRule("box-shadow", value);
	}

	shadow(
		offsetX: number = 0,
		offsetY: number = 4,
		blur: number = 6,
		spread: number = 0,
		color: string = "rgba(0,0,0,0.1)",
	): this {
		return this.boxShadow(
			`${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`,
		);
	}

	textShadow(value: string): this {
		return this.addRule("text-shadow", value);
	}

	filter(value: string): this {
		return this.addRule("filter", value);
	}

	backdropFilter(value: string): this {
		return this.addRule("backdrop-filter", value);
	}

	blur(value: CSSValue, unit?: CSSUnit): this {
		return this.filter(`blur(${this.addUnit(value, unit || "px")})`);
	}

	// TRANSITIONS & ANIMATIONS
	transition(
		property: string = "all",
		duration: string = "0.3s",
		timing: string = "ease",
		delay: string = "0s",
	): this {
		return this.addRule(
			"transition",
			`${property} ${duration} ${timing} ${delay}`,
		);
	}

	transitionProperty(value: string): this {
		return this.addRule("transition-property", value);
	}

	transitionDuration(value: string): this {
		return this.addRule("transition-duration", value);
	}

	transitionTimingFunction(value: string): this {
		return this.addRule("transition-timing-function", value);
	}

	animation(value: string): this {
		return this.addRule("animation", value);
	}

	transform(value: string): this {
		return this.addRule("transform", value);
	}

	translate(x: CSSValue, y?: CSSValue, unit?: CSSUnit): this {
		const u = unit || "px";
		if (y !== undefined) {
			return this.transform(
				`translate(${this.addUnit(x, u)}, ${this.addUnit(y, u)})`,
			);
		}
		return this.transform(`translateX(${this.addUnit(x, u)})`);
	}

	scale(value: number): this {
		return this.transform(`scale(${value})`);
	}

	rotate(value: CSSValue, unit?: CSSUnit): this {
		return this.transform(`rotate(${this.addUnit(value, unit || "deg")})`);
	}

	// OVERFLOW & VISIBILITY
	overflow(value: "visible" | "hidden" | "scroll" | "auto"): this {
		return this.addRule("overflow", value);
	}

	overflowX(value: "visible" | "hidden" | "scroll" | "auto"): this {
		return this.addRule("overflow-x", value);
	}

	overflowY(value: "visible" | "hidden" | "scroll" | "auto"): this {
		return this.addRule("overflow-y", value);
	}

	visibility(value: "visible" | "hidden" | "collapse"): this {
		return this.addRule("visibility", value);
	}

	// CURSOR & POINTER EVENTS
	cursor(
		value:
			| "auto"
			| "default"
			| "pointer"
			| "wait"
			| "text"
			| "move"
			| "not-allowed"
			| "help"
			| string,
	): this {
		return this.addRule("cursor", value);
	}

	pointerEvents(value: "auto" | "none"): this {
		return this.addRule("pointer-events", value);
	}

	userSelect(value: "none" | "auto" | "text" | "all"): this {
		return this.addRule("user-select", value);
	}

	// PSEUDO STATES
	private buildPseudoRules(
		callback: (style: Style) => void,
	): Record<string, string> {
		const inner = new Style(this.selector, this.themeManager);
		callback(inner);
		const resolved: Record<string, string> = {};
		for (const [prop, value] of Object.entries(inner.rules)) {
			resolved[prop] = this.hasTheme()
				? this.resolveVariables(value)
				: value;
		}
		return resolved;
	}

	hover(callback: (style: Style) => void): this {
		this.pseudoStates.set(":hover", this.buildPseudoRules(callback));
		return this;
	}

	disabled(callback: (style: Style) => void): this {
		this.pseudoStates.set(":disabled", this.buildPseudoRules(callback));
		return this;
	}

	focus(callback: (style: Style) => void): this {
		this.pseudoStates.set(":focus", this.buildPseudoRules(callback));
		return this;
	}

	active(callback: (style: Style) => void): this {
		this.pseudoStates.set(":active", this.buildPseudoRules(callback));
		return this;
	}

	before(callback: (style: Style) => void): this {
		this.pseudoStates.set("::before", this.buildPseudoRules(callback));
		return this;
	}

	after(callback: (style: Style) => void): this {
		this.pseudoStates.set("::after", this.buildPseudoRules(callback));
		return this;
	}

	// CHILD SELECTORS
	child(selector: string, callback: (style: Style) => void): this {
		const resolved = this.buildPseudoRules(callback);
		this.children.set(` ${selector}`, resolved);
		return this;
	}

	// MEDIA QUERIES
	media(query: string, callback: (style: Style) => void): this {
		const mediaStyle = new Style(this.selector);
		callback(mediaStyle);
		this.mediaQueries.set(query, mediaStyle.rules);
		return this;
	}

	// Helpers for media queries
	mobile(callback: (style: Style) => void): this {
		return this.media("(max-width: 768px)", callback);
	}

	tablet(callback: (style: Style) => void): this {
		return this.media(
			"(min-width: 769px) and (max-width: 1024px)",
			callback,
		);
	}

	desktop(callback: (style: Style) => void): this {
		return this.media("(min-width: 1025px)", callback);
	}

	// RAW CSS
	raw(property: string, value: string): this {
		const resolvedValue = this.hasTheme()
			? this.resolveVariables(value)
			: value;
		this.rules[property] = resolvedValue;
		return this;
	}

	var(property: string, value: string): this {
		return this.raw(property, value);
	}

	css(styles: Record<string, string>): this {
		Object.assign(this.rules, styles);
		return this;
	}

	// GENERATION & APPLICATION
	private generateCSS(): string {
		let css = "";

		// Main rules
		if (Object.keys(this.rules).length > 0) {
			css += `${this.selector} {\n`;
			for (const [prop, value] of Object.entries(this.rules)) {
				css += `  ${prop}: ${value};\n`;
			}
			css += "}\n\n";
		}

		// Pseudo states
		for (const [pseudo, rules] of this.pseudoStates) {
			css += `${this.selector}${pseudo} {\n`;
			for (const [prop, value] of Object.entries(rules)) {
				css += `  ${prop}: ${value};\n`;
			}
			css += "}\n\n";
		}

		// Children
		for (const [childSelector, rules] of this.children) {
			css += `${this.selector}${childSelector} {\n`;
			for (const [prop, value] of Object.entries(rules)) {
				css += `  ${prop}: ${value};\n`;
			}
			css += "}\n\n";
		}

		// Media queries
		for (const [query, rules] of this.mediaQueries) {
			css += `@media ${query} {\n`;
			css += `  ${this.selector} {\n`;
			for (const [prop, value] of Object.entries(rules)) {
				css += `    ${prop}: ${value};\n`;
			}
			css += "  }\n";
			css += "}\n\n";
		}

		return css;
	}

	apply(): this {
		const css = this.generateCSS();
		Style.globalStyles[this.selector] = this.rules;

		if (this._useContext) {
			if (css.trim()) {
				StyleContext.getInstance().register(css, this._priority);
			}
		} else {
			if (!Style.styleElement) {
				Style.styleElement = document.createElement("style");
				Style.styleElement.setAttribute("data-style-creator", "true");
				document.head.appendChild(Style.styleElement);
			}
			Style.styleElement.textContent += css;
		}

		return this;
	}

	toString(): string {
		return this.generateCSS();
	}

	static create(selector: string): Style {
		return new Style(selector);
	}

	static clearAll(): void {
		if (Style.styleElement) {
			Style.styleElement.remove();
			Style.styleElement = null;
		}
		Style.globalStyles = {};
	}
}
