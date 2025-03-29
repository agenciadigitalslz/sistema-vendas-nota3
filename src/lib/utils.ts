// Função simplificada para substituir clsx e twMerge
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// Função para formatar a data e hora no formato DD.MM.YYYY_HH:MM (timezone Brasil)
export function formatDateTime(isoString: string): string {
  try {
    // Converter string ISO para objeto Date
    const date = new Date(isoString);
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      console.error("Data inválida:", isoString);
      return isoString;
    }
    
    // Formatar data no formato brasileiro com underline entre data e hora
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    
    // Ajustar para timezone Brasil (GMT-3)
    let hours = date.getUTCHours() - 3;
    // Corrigir caso a hora fique negativa (volta para o dia anterior)
    if (hours < 0) hours += 24;
    
    const hoursStr = hours.toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    
    return `${day}.${month}.${year}_${hoursStr}:${minutes}`;
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return isoString;
  }
}
