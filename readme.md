#Деплоймент
1. ol Добавить ip адрес в ansible hosts
2. ol Настроить ssh подключение к серверу через rsa ключ
3. ol configure_server.yml - устанавливает зависимости и настраивает среду
4. ol start.yml - запускает сервер(ngninx, uwsgi)
#API
1. ol Доступ к api через /api/v1
2. ol Сейчас работает доступ к таблице experiment
3. ol Сейчас сайт доступен по адресу 104.154.77.126/
#Пример запросов
1. ol 104.154.77.126/api/v1/experiments - список всех записей по 10 штук
2. ol 104.154.77.126/api/v1/experiments/?position=Alaska - все эксперементы проведенные в Аляске
3. ol Доступны  следующие поля: date_conducted, latitude, longitude, position, genbank_id
4. ol Данные возвращаются в формате json