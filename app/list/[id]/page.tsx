"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Share2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { getShoppingList, type ShoppingList } from "@/lib/storage"
import { SimpleList } from "@/components/SimpleList"
import { ComplexList } from "@/components/ComplexList"
import { formatDate } from "@/lib/date"

export default function ShoppingListPage({ params }: { params: { id: string } }) {
  const [list, setList] = useState<ShoppingList | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchedList = getShoppingList(params.id)
    if (fetchedList) {
      setList(fetchedList)
    } else {
      router.push("/")
    }
  }, [params.id, router])

  const shareList = () => {
    const shareUrl = `${window.location.origin}/shared/${params.id}`
    navigator.clipboard.writeText(shareUrl)
    toast.success("Enlace copiado al portapapeles")
  }

  if (!list) return null

  return (
    <div className="container mx-auto p-4 max-w-md">
      <ToastContainer position="bottom-center" />
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.push("/")} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Button>
          <Button variant="ghost" onClick={shareList} size="sm">
            <Share2 className="h-4 w-4 mr-2" /> Compartir
          </Button>
        </div>
        <h1 className="text-xl font-bold text-center">{list.name}</h1>
        <div className="text-sm text-muted-foreground text-center">Creada: {formatDate(new Date(list.createdAt))}</div>
      </div>
      {list.type === "simple" ? (
        <SimpleList list={list} onUpdate={setList} />
      ) : (
        <ComplexList list={list} onUpdate={setList} />
      )}
    </div>
  )
}

