import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type AIModel = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

const AI_MODELS: AIModel[] = [
  {
    id: 'gpt4',
    name: 'GPT-4',
    description: 'Самая продвинутая модель OpenAI',
    icon: '🧠',
  },
  {
    id: 'claude',
    name: 'Claude 3',
    description: 'Мощный ассистент от Anthropic',
    icon: '🤖',
  },
  {
    id: 'llama',
    name: 'Llama 3.1',
    description: 'Открытая модель Meta',
    icon: '🦙',
  },
  {
    id: 'mistral',
    name: 'Mistral Large',
    description: 'Европейская альтернатива',
    icon: '⚡',
  },
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! Я локальный ИИ-ассистент. Выбери модель и задай мне любой вопрос 🚀',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('gpt4');
  const [isTyping, setIsTyping] = useState(false);

  const generateResponse = (userInput: string, model: string): string => {
    const modelData = AI_MODELS.find((m) => m.id === model);
    const lowerInput = userInput.toLowerCase();

    const topics = [
      {
        keywords: /привет|здравствуй|hi|hello|hey|добрый/,
        responses: [
          `Привет! 👋 Я ${modelData?.name} — языковая модель, готовая помочь с любыми вопросами. О чём поговорим?`,
          `Здравствуй! Я ${modelData?.name}. Могу обсудить науку, литературу, технологии, философию — всё что угодно!`,
          `Рад видеть! ${modelData?.icon} Задавай любые вопросы — от программирования до истории искусства.`,
        ]
      },
      {
        keywords: /погода|weather|температура|климат/,
        responses: [
          `Я работаю полностью офлайн, поэтому не знаю актуальной погоды. Но могу рассказать:\n\n📊 Как метеорологи предсказывают погоду?\n🌍 Почему меняется климат?\n☁️ Как формируются облака и осадки?\n\nО чём подробнее?`,
          `Актуальных данных у меня нет — я локальный ИИ без интернета. Зато могу объяснить физику атмосферы, парниковый эффект или рассказать о самых экстремальных погодных явлениях на Земле!`,
        ]
      },
      {
        keywords: /код|code|программ|javascript|python|typescript|react|функци|алгоритм|разработк/,
        responses: [
          `Отлично! ${modelData?.icon} Я специализируюсь на программировании. Могу:\n\n• Написать код на Python, JS, TS, C++\n• Объяснить алгоритмы и структуры данных\n• Помочь с отладкой\n• Порекомендовать архитектуру\n\nЧто именно нужно?`,
          `Программирование — моя сильная сторона! Какой язык интересует? Могу показать примеры, объяснить концепции или помочь с конкретной задачей.`,
          `Давай разберём код! ${modelData?.icon} Вот пример быстрой сортировки на Python:\n\ndef quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)\n\nЧто хочешь разобрать?`,
        ]
      },
      {
        keywords: /ты кто|what are you|кто ты|модель|model|как работаешь|что ты|искусственный/,
        responses: [
          `Я ${modelData?.name} — ${modelData?.description.toLowerCase()}. ${modelData?.icon}\n\nРаботаю как большая языковая модель: обучен на огромных объёмах текста, предсказываю следующие слова в контексте. Это позволяет отвечать на вопросы, писать код, объяснять концепции.\n\nВ этой демо-версии всё работает локально — твои данные не уходят в интернет!`,
          `${modelData?.icon} Я ${modelData?.name} — нейросеть-трансформер с миллиардами параметров. Обучена на текстах из книг, статей, кода. Могу:\n\n✅ Генерировать текст\n✅ Анализировать информацию\n✅ Писать код\n✅ Отвечать на вопросы\n\nИ всё это офлайн!`,
        ]
      },
      {
        keywords: /математика|math|посчита|вычисли|решить|\d+\s*[\+\-\*\/]\s*\d+|уравнение|формула|геометрия/,
        responses: [
          `Математика! ${modelData?.icon} Давай решим:\n\n• Арифметика: 2 + 2 = 4, 15 × 7 = 105\n• Алгебра: x² - 5x + 6 = 0 → x = 2 или x = 3\n• Геометрия: площадь круга = πr²\n\nКакую задачу разбираем?`,
          `С удовольствием помогу с математикой! ${modelData?.icon} Например:\n\n∫ x² dx = x³/3 + C\ne^(iπ) + 1 = 0 (формула Эйлера)\n\nЧто нужно посчитать или объяснить?`,
        ]
      },
      {
        keywords: /история|history|война|древн|век|царь|император|революция/,
        responses: [
          `История — увлекательная наука! ${modelData?.icon}\n\nМогу рассказать о:\n• Древних цивилизациях (Египет, Рим, Греция)\n• Средневековье и эпоха Возрождения\n• Мировые войны XX века\n• История России от Киевской Руси до наших дней\n\nЧто интересно?`,
          `${modelData?.icon} Отличный вопрос по истории! Например, знаешь ли ты, что Римская империя просуществовала более 1000 лет? Или что порох изобрели в Китае в IX веке?\n\nО каком периоде хочешь узнать больше?`,
        ]
      },
      {
        keywords: /наука|физика|химия|биология|science|эксперимент|молекула|атом|клетка|днк/,
        responses: [
          `Наука! ${modelData?.icon} Моя любимая тема:\n\n⚛️ Физика: квантовая механика, теория относительности\n🧪 Химия: периодическая таблица, реакции\n🧬 Биология: ДНК, эволюция, экосистемы\n\nЧто разбираем?`,
          `${modelData?.icon} Научный вопрос — отлично! Например, знаешь ли ты, что вся материя состоит из атомов, которые на 99,9999% — пустое пространство? Или что ДНК человека содержит ~3 миллиарда пар оснований?\n\nО чём хочешь узнать?`,
        ]
      },
      {
        keywords: /книг|литература|писатель|роман|поэзия|стих|автор|читать/,
        responses: [
          `Литература! ${modelData?.icon} Могу обсудить:\n\n📚 Классику: Толстой, Достоевский, Пушкин, Шекспир\n📖 Современную прозу и поэзию\n✍️ Литературные приёмы и стили\n\nКакие авторы или произведения интересуют?`,
          `${modelData?.icon} Отличная тема! Например, "Война и мир" Толстого — один из величайших романов, описывает жизнь русского общества в эпоху наполеоновских войн через судьбы нескольких семей.\n\nО каких книгах поговорим?`,
        ]
      },
      {
        keywords: /музыка|music|песня|композитор|инструмент|жанр|группа|альбом/,
        responses: [
          `Музыка! ${modelData?.icon} Могу рассказать о:\n\n🎵 Классике: Бах, Моцарт, Бетховен\n🎸 Рок и поп: от The Beatles до современности\n🎹 Теория музыки: аккорды, гаммы, ритм\n\nЧто интересует?`,
          `${modelData?.icon} Музыкальный вопрос! Например, знаешь ли ты, что гармония в музыке основана на физике звука — частоты нот соотносятся как простые дроби: октава = 2:1, квинта = 3:2?\n\nО чём хочешь узнать?`,
        ]
      },
      {
        keywords: /философия|философ|смысл жизни|этика|мораль|сознание|истина|бытие/,
        responses: [
          `Философия! ${modelData?.icon} Глубокая тема:\n\n🤔 Античность: Сократ, Платон, Аристотель\n💭 Новое время: Декарт, Кант, Ницше\n🧠 Философия сознания: что такое "я"?\n\nО чём поразмышляем?`,
          `${modelData?.icon} Философский вопрос! Например, Декарт сказал "Cogito, ergo sum" (Я мыслю, значит существую) — единственное, в чём мы можем быть абсолютно уверены, это наличие нашего мышления.\n\nКакие идеи обсудим?`,
        ]
      },
    ];

    for (const topic of topics) {
      if (lowerInput.match(topic.keywords)) {
        return `${modelData?.icon} ${topic.responses[Math.floor(Math.random() * topic.responses.length)]}`;
      }
    }

    const generalResponses = [
      `Интересный вопрос! ${modelData?.icon} Как языковая модель, я могу обсудить практически любую тему — от квантовой физики до средневековой поэзии. Расскажи подробнее, что именно интересует?`,
      `${modelData?.icon} Отлично! Я обучен на широком спектре знаний. Могу помочь с программированием, объяснить научные концепции, обсудить историю или литературу. Уточни вопрос?`,
      `Хороший запрос! ${modelData?.icon} Работая как локальный ИИ, я могу:\n\n• Отвечать на вопросы по разным темам\n• Писать и объяснять код\n• Генерировать тексты\n• Решать логические задачи\n\nЧто конкретно нужно?`,
      `${modelData?.icon} Понял! Давай разберём этот вопрос. Я могу проанализировать проблему с разных сторон — научной, практической, исторической. Что именно хочешь узнать?`,
      `Занятная тема! ${modelData?.icon} Мои знания охватывают науку, технологии, искусство, гуманитарные дисциплины. Чем глубже вопрос — тем интереснее ответ. Уточни детали?`,
    ];

    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(currentInput, selectedModel),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col">
      <header className="border-b border-border/50 backdrop-blur-lg bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Icon name="Brain" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">LocalAI</h1>
              <p className="text-xs text-muted-foreground">Без интернета</p>
            </div>
          </div>

          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[220px] bg-card/50 border-border/50 hover:bg-card transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AI_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{model.icon}</span>
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {model.description}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <ScrollArea className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6 pb-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 animate-fade-in ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar
                className={`w-10 h-10 shrink-0 ring-2 ${
                  message.role === 'user'
                    ? 'ring-secondary/30'
                    : 'ring-primary/30'
                }`}
              >
                <AvatarFallback
                  className={
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-secondary to-accent text-white'
                      : 'bg-gradient-to-br from-primary to-secondary text-white'
                  }
                >
                  {message.role === 'user' ? (
                    <Icon name="User" size={20} />
                  ) : (
                    <Icon name="Sparkles" size={20} />
                  )}
                </AvatarFallback>
              </Avatar>

              <Card
                className={`p-4 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-secondary/20 to-accent/20 border-secondary/30'
                    : 'bg-card/50 border-border/50'
                } backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {message.timestamp.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </Card>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 animate-fade-in">
              <Avatar className="w-10 h-10 shrink-0 ring-2 ring-primary/30">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                  <Icon name="Sparkles" size={20} />
                </AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-card/50 border-border/50 backdrop-blur-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border/50 backdrop-blur-lg bg-background/80 sticky bottom-0">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Input
              placeholder="Напишите сообщение..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-card/50 border-border/50 focus:ring-2 focus:ring-primary/30 transition-all"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all shadow-lg hover:shadow-xl px-6"
            >
              <Icon name="Send" size={20} />
            </Button>
          </div>
          <div className="max-w-4xl mx-auto mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Icon name="Lock" size={14} />
            <span>Все данные обрабатываются локально на вашем устройстве</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;