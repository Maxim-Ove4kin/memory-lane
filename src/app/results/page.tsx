"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface Recipe {
  id: number
  title: string
  description: string
  cookTime: string
  difficulty: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Получаем параметры поиска из localStorage или URL
    const query = localStorage.getItem('searchQuery') || 'Пользовательский запрос'
    setSearchQuery(query)
    
    // Симуляция загрузки данных
    setTimeout(() => {
      // Примерные данные рецептов
      const sampleRecipes: Recipe[] = [
        {
          id: 1,
          title: "Овощной суп",
          description: "Вкусный и питательный овощной суп с сезонными овощами",
          cookTime: "30 мин",
          difficulty: "Легко"
        },
        {
          id: 2,
          title: "Курица в горшочке",
          description: "Ароматная курица с овощами, приготовленная в горшочке",
          cookTime: "45 мин",
          difficulty: "Средне"
        },
        {
          id: 3,
          title: "Фруктовый салат",
          description: "Освежающий фруктовый салат с йогуртовой заправкой",
          cookTime: "15 мин",
          difficulty: "Легко"
        }
      ]
      setRecipes(sampleRecipes)
      setLoading(false)
    }, 1000)
  }, [])

  const handleNewSearch = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Заголовок страницы результатов */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-700 mb-4">
          Результаты поиска 🍳
        </h1>
        <p className="text-xl text-gray-600">
          По запросу: <span className="font-semibold text-amber-600">{searchQuery}</span>
        </p>
        <div className="wavy-underline w-32 h-1 bg-amber-400 mx-auto mt-4"></div>
      </div>

      {/* Кнопка нового поиска */}
      <div className="flex justify-center mb-8">
        <Button 
          onClick={handleNewSearch}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 hover:scale-105"
        >
          🔍 Новый поиск
        </Button>
      </div>

      {/* Индикатор загрузки */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
          <p className="text-xl text-gray-600">Ищем рецепты для вас...</p>
        </div>
      )}

      {/* Результаты поиска */}
      {!loading && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-right">
            <p className="text-lg text-gray-600">
              Найдено рецептов: <span className="font-bold text-amber-600">{recipes.length}</span>
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div 
                key={recipe.id} 
                className="sketch-border-card sketch-shadow p-6 rounded-xl bg-white transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-green-800 mb-2">{recipe.title}</h3>
                  <div className="wavy-underline w-16 h-0.5 bg-green-600 mx-auto mb-3"></div>
                </div>
                
                <p className="text-gray-600 mb-4 min-h-[60px]">{recipe.description}</p>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm">
                    <span className="font-bold text-amber-600">⏱️ {recipe.cookTime}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-purple-600">📊 {recipe.difficulty}</span>
                  </div>
                </div>
                
                <Button className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-colors">
                  Подробнее
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Сообщение если ничего не найдено */}
      {!loading && recipes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Рецепты не найдены</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Попробуйте изменить параметры поиска или воспользуйтесь другим запросом.
          </p>
        </div>
      )}
    </div>
  )
}