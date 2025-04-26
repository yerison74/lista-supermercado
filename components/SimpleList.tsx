"use client"

import { useState } from "react"
import { Plus, Minus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { type ShoppingList, type SimpleItem, updateShoppingList } from "@/lib/storage"

interface SimpleListProps {
  list: ShoppingList
  onUpdate: (updatedList: ShoppingList) => void
}

export function SimpleList({ list, onUpdate }: SimpleListProps) {
  const [newItem, setNewItem] = useState("")
  const [newItemQuantity, setNewItemQuantity] = useState(1)

  const addItem = () => {
    if (newItem.trim() !== "") {
      const updatedList = {
        ...list,
        items: [
          ...list.items,
          { id: Date.now().toString(), name: newItem, quantity: newItemQuantity, completed: false },
        ],
      }
      updateShoppingList(updatedList)
      onUpdate(updatedList)
      setNewItem("")
      setNewItemQuantity(1)
    }
  }

  const toggleItem = (id: string) => {
    const updatedList = {
      ...list,
      items: list.items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
    }
    updateShoppingList(updatedList)
    onUpdate(updatedList)
  }

  const removeItem = (id: string) => {
    const updatedList = {
      ...list,
      items: list.items.filter((item) => item.id !== id),
    }
    updateShoppingList(updatedList)
    onUpdate(updatedList)
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      const updatedList = {
        ...list,
        items: list.items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)),
      }
      updateShoppingList(updatedList)
      onUpdate(updatedList)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Agregar item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-grow"
        />
        <Input
          type="number"
          value={newItemQuantity}
          onChange={(e) => setNewItemQuantity(Number.parseInt(e.target.value) || 1)}
          className="w-20"
        />
        <Button onClick={addItem}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {(list.items as SimpleItem[]).map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-secondary p-2 rounded-md">
            <div className="flex items-center space-x-2">
              <Checkbox checked={item.completed} onCheckedChange={() => toggleItem(item.id)} />
              <span className={`${item.completed ? "line-through text-muted-foreground" : ""}`}>{item.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

