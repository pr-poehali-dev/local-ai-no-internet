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

    const responses: { [key: string]: string[] } = {
      greeting: [
        `${modelData?.icon} Привет! Я ${modelData?.name}. Чем могу помочь?`,
        `${modelData?.icon} Здравствуй! Готов ответить на твои вопросы.`,
        `${modelData?.icon} Рад видеть! Что тебя интересует?`,
      ],
      weather: [
        `${modelData?.icon} К сожалению, я работаю полностью офлайн и не имею доступа к актуальным данным о погоде. Но могу рассказать о том, как работают метеорологические модели!`,
        `${modelData?.icon} Я локальный ИИ без доступа к интернету, поэтому не могу проверить погоду. Зато могу объяснить, как формируются облака!`,
      ],
      code: [
        `${modelData?.icon} Конечно! Вот пример на JavaScript:\n\nconst hello = () => {\n  console.log("Hello, World!");\n};\n\nЧто именно хочешь узнать о коде?`,
        `${modelData?.icon} Давай разберём код! Какой язык программирования тебя интересует? Python, JavaScript, TypeScript?`,
      ],
      ai: [
        `${modelData?.icon} Я — ${modelData?.name}, ${modelData?.description}. Работаю полностью локально на твоём устройстве без отправки данных в интернет!`,
        `${modelData?.icon} ${modelData?.description}. Это значит, что все твои данные остаются на твоём устройстве. Полная приватность!`,
      ],
      math: [
        `${modelData?.icon} Давай решим! Например: 2 + 2 = 4, или π ≈ 3.14159. Какую задачу разбираем?`,
        `${modelData?.icon} Математика — это интересно! Могу помочь с арифметикой, алгеброй, геометрией. Что считаем?`,
      ],
      default: [
        `${modelData?.icon} Отличный вопрос! Как локальный ИИ, я могу помочь с различными задачами: программирование, объяснение концепций, создание текстов и многое другое.`,
        `${modelData?.icon} Интересная тема! Расскажи подробнее, что именно тебя интересует?`,
        `${modelData?.icon} Хороший запрос! Работая локально, я обрабатываю информацию прямо на твоём устройстве. Чем конкретно помочь?`,
        `${modelData?.icon} Понял тебя! Давай разберём этот вопрос. Нужна помощь с кодом, текстом или объяснением концепции?`,
      ],
    };

    if (lowerInput.match(/привет|здравствуй|hi|hello|hey/)) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    }
    if (lowerInput.match(/погода|weather|температура/)) {
      return responses.weather[Math.floor(Math.random() * responses.weather.length)];
    }
    if (lowerInput.match(/код|code|программ|javascript|python|typescript/)) {
      return responses.code[Math.floor(Math.random() * responses.code.length)];
    }
    if (lowerInput.match(/ты кто|what are you|кто ты|модель|model/)) {
      return responses.ai[Math.floor(Math.random() * responses.ai.length)];
    }
    if (lowerInput.match(/\d|математика|math|посчита|вычисли|решить/)) {
      return responses.math[Math.floor(Math.random() * responses.math.length)];
    }

    return responses.default[Math.floor(Math.random() * responses.default.length)];
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