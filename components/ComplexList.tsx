"use client"

import { useState } from "react"
import { Plus, Minus, Edit2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { type ShoppingList, type ComplexItem, updateShoppingList, formatPrice } from "@/lib/storage"

const categories = ["Frutas y Verduras", "Lácteos", "Carnes", "Panadería", "Limpieza", "Otros"]

interface ComplexListProps {
  list: ShoppingList
  onUpdate: (updatedList: ShoppingList) => void
}

export function ComplexList({ list, onUpdate }: ComplexListProps) {
  const [newItem, setNewItem] = useState("")
  const [newItemPrice, setNewItemPrice] = useState("")
  const [newItemQuantity, setNewItemQuantity] = useState(1)
  const [category, setCategory] = useState("Otros")
  const [isEditingBudget, setIsEditingBudget] = useState(false)
  const [newBudget, setNewBudget] = useState(list.budget?.toString() || "")
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [newPrice, setNewPrice] = useState<string>("")

  const addItem = () => {
    if (newItem.trim() !== "" && newItemPrice.trim() !== "") {
      const price = Number.parseFloat(newItemPrice)
      if (!isNaN(price)) {
        const updatedList = {
          ...list,
          items: [
            ...list.items,
            { id: Date.now().toString(), name: newItem, category, completed: false, price, quantity: newItemQuantity },
          ],
        }
        updateShoppingList(updatedList)
        onUpdate(updatedList)
        setNewItem("")
        setNewItemPrice("")
        setNewItemQuantity(1)
      }
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

  const updateBudget = () => {
    const budget = Number.parseFloat(newBudget)
    if (!isNaN(budget) && budget > 0) {
      const updatedList = {
        ...list,
        budget,
      }
      updateShoppingList(updatedList)
      onUpdate(updatedList)
      setIsEditingBudget(false)
    }
  }

  const updatePrice = (id: string, newPrice: string) => {
    const price = Number.parseFloat(newPrice)
    if (!isNaN(price) && price > 0) {
      const updatedList = {
        ...list,
        items: list.items.map((item) => (item.id === id ? { ...item, price } : item)),
      }
      updateShoppingList(updatedList)
      onUpdate(updatedList)
      setEditingPrice(null)
    }
  }

  const calculateTotal = () => {
    return (list.items as ComplexItem[]).reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateAvailableMoney = () => {
    return (list.budget || 0) - calculateTotal()
  }

  const total = calculateTotal()
  const progress = list.budget ? Math.min((total / list.budget) * 100, 100) : 0

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {isEditingBudget ? (
          <div className="flex space-x-2">
            <Input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              placeholder="Nuevo presupuesto"
              className="flex-grow"
            />
            <Button onClick={updateBudget}>Guardar</Button>
            <Button variant="outline" onClick={() => setIsEditingBudget(false)}>
              Cancelar
            </Button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span>Presupuesto: {formatPrice(list.budget || 0)}</span>
            <Button variant="outline" size="sm" onClick={() => setIsEditingBudget(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span>Total: {formatPrice(total)}</span>
          <span>Disponible: {formatPrice(calculateAvailableMoney())}</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
      <div className="space-y-2">
        <Input type="text" placeholder="Agregar item..." value={newItem} onChange={(e) => setNewItem(e.target.value)} />
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Precio (DOP)"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            className="flex-grow"
          />
          <Input
            type="number"
            placeholder="Cantidad"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(Number.parseInt(e.target.value) || 1)}
            className="w-20"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addItem} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </div>
      <div className="space-y-2">
        {(list.items as ComplexItem[]).map((item) => (
          <div key={item.id} className="flex flex-col bg-secondary p-2 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox checked={item.completed} onCheckedChange={() => toggleItem(item.id)} />
                <span className={`${item.completed ? "line-through text-muted-foreground" : ""}`}>{item.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">{item.category}</span>
              {editingPrice === item.id ? (
                <div className="flex items-center space-x-1">
                  <Input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-20"
                  />
                  <Button size="sm" onClick={() => updatePrice(item.id, newPrice)}>
                    ✓
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingPrice(null)}>
                    ✗
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <span>{formatPrice(item.price)}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingPrice(item.id)
                      setNewPrice(item.price.toString())
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end space-x-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span>{item.quantity}</span>
              <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

