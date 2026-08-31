import type { CartItem } from "@/lib/types/cart";

export type CartState = { items: CartItem[] };

export type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; lineId: string }
  | { type: "UPDATE_QUANTITY"; lineId: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      // Merge with an existing line that matches the same item + date selection.
      const existing = state.items.find((line) => sameLine(line, action.item));
      if (existing) {
        return {
          items: state.items.map((line) =>
            line.lineId === existing.lineId
              ? { ...line, quantity: line.quantity + action.item.quantity }
              : line,
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((line) => line.lineId !== action.lineId) };
    case "UPDATE_QUANTITY":
      return {
        items: state.items
          .map((line) =>
            line.lineId === action.lineId
              ? { ...line, quantity: Math.max(1, action.quantity) }
              : line,
          )
          .filter((line) => line.quantity > 0),
      };
    case "CLEAR":
      return { items: [] };
    case "HYDRATE":
      return { items: action.items };
    default:
      return state;
  }
}

function sameLine(a: CartItem, b: CartItem): boolean {
  if (a.type !== b.type) return false;
  if (a.type === "package" && b.type === "package") {
    return a.packageId === b.packageId && a.startDate === b.startDate;
  }
  if (a.type === "experience" && b.type === "experience") {
    return a.experienceId === b.experienceId && a.selectedDate === b.selectedDate;
  }
  if (a.type === "product" && b.type === "product") {
    return a.productId === b.productId;
  }
  return false;
}
