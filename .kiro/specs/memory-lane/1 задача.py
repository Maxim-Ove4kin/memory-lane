print("=" * 30)
print("ЗАДАНИЕ №1: Анализ успеваемости")
print("=" * 30)

# Исходные данные
grades = [4, 5, 3, 4, 2, 5, 4, 3, 5, 4, 2, 3, 4, 5, 3]

# 1. Подсчёт количества каждой оценки
count_5 = grades.count(5)
count_4 = grades.count(4)
count_3 = grades.count(3)
count_2 = grades.count(2)

print(f"Оценки: пятёрок - {count_5}, четвёрок - {count_4}, троек - {count_3}, двоек - {count_2}")

# 2. Количество положительных оценок (4 и 5)
positive_count = sum(1 for g in grades if g >= 4)
print(f"Положительных оценок: {positive_count}")

# 3. Процент неудовлетворительных оценок (2 и 3)
unsatisfactory_count = sum(1 for g in grades if g <= 3)
total_students = len(grades)

# Проверка деления на ноль
if total_students > 0:
    unsatisfactory_percent = (unsatisfactory_count / total_students) * 100
else:
    unsatisfactory_percent = 0.0

print(f"Процент неудовлетворительных: {unsatisfactory_percent}%")