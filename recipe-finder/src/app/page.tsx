import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Рисованные таблички сверху */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-4 flex-wrap justify-center">
          <div className="bg-rose-300 px-4 py-2 rotate-neg-2 sketch-border hand-drawn-card sketch-shadow text-rose-700">
            <span className="font-bold text-sm">РЕЦЕПТЫ</span>
          </div>
          <div className="bg-amber-300 px-4 py-2 rotate-1 sketch-border hand-drawn-card sketch-shadow text-amber-700">
            <span className="font-bold text-sm">ПОИСК</span>
          </div>
          <div className="bg-teal-300 px-4 py-2 rotate-neg-1 sketch-border hand-drawn-card sketch-shadow text-teal-700">
            <span className="font-bold text-sm">КУХНЯ</span>
          </div>
          <div className="bg-purple-300 px-4 py-2 rotate-2 sketch-border hand-drawn-card sketch-shadow text-purple-700">
            <span className="font-bold text-sm">БЛЮДА</span>
          </div>
        </div>
      </div>

      {/* Главный заголовок */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold text-amber-700 mb-4 wobble" style={{color: '#8b6914'}}>
          Recipe Finder 🍳
        </h1>
        <div className="wavy-underline w-32 h-1 bg-amber-400 mx-auto rotate-1" style={{backgroundColor: '#e6d19a'}}></div>
      </div>
      
      {/* Основная карточка поиска */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="sketch-border-card sketch-shadow p-8 rounded-2xl rotate-neg-1 bg-green-200" style={{background: 'linear-gradient(135deg, #d1f2d9 0%, #e8f7ec 50%, #f4fbf6 100%)'}}>
          <div className="text-center mb-8">
            <h2 className="text-3xl text-green-800 font-bold rotate-1">
              🔍 Поиск рецептов
            </h2>
            <div className="wavy-underline w-24 h-0.5 bg-green-600 mx-auto mt-2 rotate-neg-1"></div>
          </div>
          
          <div className="space-y-6">
            <div className="rotate-0-5">
              <label className="block text-lg font-bold text-green-700 mb-3 rotate-neg-0-5 wavy-underline">
                🍽️ Поиск по названию блюда
              </label>
              <div className="sketch-border-card bg-white/90 rounded-xl">
                <Input 
                  placeholder="Например: борщ, плов, салат цезарь..."
                  className="w-full text-lg p-4 border-0 bg-transparent backdrop-blur-sm rotate-0-5 focus:rotate-0 transition-transform"
                  style={{outline: 'none', boxShadow: 'none'}}
                />
              </div>
            </div>
            
            <div className="rotate-neg-0-5">
              <label className="block text-lg font-bold text-green-700 mb-3 rotate-0-5 wavy-underline">
                🥕 Поиск по ингредиентам (через ;)
              </label>
              <div className="sketch-border-card bg-white/90 rounded-xl">
                <Input 
                  placeholder="Например: морковь; капуста; лук; мясо"
                  className="w-full text-lg p-4 border-0 bg-transparent backdrop-blur-sm rotate-neg-0-5 focus:rotate-0 transition-transform"
                  style={{outline: 'none', boxShadow: 'none'}}
                />
              </div>
            </div>
            
            <div className="text-center pt-4">
              <div className="sketch-border-button bg-amber-400 rounded-xl inline-block">
                <button className="text-xl px-8 py-4 bg-transparent hover:bg-amber-500/20 text-amber-900 font-bold border-0 rotate-1 hover:rotate-0 transition-all duration-300 hover:scale-105 rounded-xl">
                  🎯 Найти рецепты!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Нижние карточки */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="sketch-border-card sketch-shadow p-6 rounded-xl rotate-1 hover:rotate-0 transition-transform" style={{backgroundColor: '#c7d9f1', background: 'linear-gradient(135deg, #c7d9f1 0%, #e1ecf7 100%)'}}>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-800 mb-2 wavy-underline">🧑‍🍳 Шеф-повар</h3>
            <p className="text-blue-700">Профессиональные рецепты от лучших поваров</p>
          </div>
        </div>
        
        <div className="sketch-border-card sketch-shadow p-6 rounded-xl rotate-neg-1 hover:rotate-0 transition-transform" style={{backgroundColor: '#f2dcc7', background: 'linear-gradient(135deg, #f2dcc7 0%, #f7ede1 100%)'}}>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-orange-800 mb-2 wavy-underline">🍰 Наши блюда</h3>
            <p className="text-orange-700">Более 1000 проверенных рецептов</p>
          </div>
        </div>
        
        <div className="sketch-border-card sketch-shadow p-6 rounded-xl rotate-2 hover:rotate-0 transition-transform" style={{backgroundColor: '#c0eee0', background: 'linear-gradient(135deg, #c0eee0 0%, #d9f4ed 100%)'}}>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-teal-800 mb-2 wavy-underline">📱 Быстро</h3>
            <p className="text-teal-700">Мгновенный поиск по ингредиентам</p>
          </div>
        </div>
      </div>
    </div>
  )
}
