"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  getShoppingLists,
  createShoppingList,
  deleteShoppingList,
  type ShoppingList,
  formatPrice,
  formatDate,
} from "@/lib/storage"

export default function Home() {
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [newListName, setNewListName] = useState("")
  const [newListType, setNewListType] = useState<"simple" | "complex">("simple")
  const [newBudget, setNewBudget] = useState("")
  const [isCreatingList, setIsCreatingList] = useState(false)

  useEffect(() => {
    setLists(getShoppingLists())
  }, [])

  const addList = () => {
    if (newListName.trim() !== "") {
      if (newListType === "simple") {
        const newList = createShoppingList(newListName, "simple")
        setLists([...lists, newList])
        setNewListName("")
      } else if (newListType === "complex" && newBudget.trim() !== "") {
        const budget = Number.parseFloat(newBudget)
        if (!isNaN(budget)) {
          const newList = createShoppingList(newListName, "complex", budget)
          setLists([...lists, newList])
          setNewListName("")
          setNewBudget("")
        }
      }
      setIsCreatingList(false)
    }
  }

  const removeList = (id: string) => {
    deleteShoppingList(id)
    setLists(lists.filter((list) => list.id !== id))
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Mis Listas de Compras</h1>
      {isCreatingList ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Nueva Lista</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Nombre de la lista"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <Select value={newListType} onValueChange={(value: "simple" | "complex") => setNewListType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de lista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Lista Simple</SelectItem>
                <SelectItem value="complex">Lista Compleja</SelectItem>
              </SelectContent>
            </Select>
            {newListType === "complex" && (
              <Input
                type="number"
                placeholder="Presupuesto (DOP)"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreatingList(false)}>
              Cancelar
            </Button>
            <Button onClick={addList}>Crear Lista</Button>
          </CardFooter>
        </Card>
      ) : (
        <Button className="w-full mb-6" onClick={() => setIsCreatingList(true)}>
          <Plus className="mr-2 h-4 w-4" /> Crear Nueva Lista
        </Button>
      )}
      <div className="space-y-4">
        {lists.map((list) => (
          <Card key={list.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{list.name}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{list.items.length} items</span>
                <span>{list.type === "simple" ? "Simple" : "Compleja"}</span>
              </div>
              {list.type === "complex" && (
                <div className="text-sm font-medium mt-1">Presupuesto: {formatPrice(list.budget || 0)}</div>
              )}
              <div className="text-xs text-muted-foreground mt-1">Creada: {formatDate(new Date(list.createdAt))}</div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/list/${list.id}`}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Ver Lista
                </Link>
              </Button>
              <Button variant="destructive" size="sm" onClick={() => removeList(list.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

