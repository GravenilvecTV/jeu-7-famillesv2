export const Message = ({ message, variant = 'info' }) => {
  if (!message) return null;
  
  const variants = {
    info: 'text-blue-700',
    success: 'text-green-700',
    warning: 'text-yellow-700',
    error: 'text-red-600',
  };
  
  return (
    <div className={`mb-2 text-lg font-bold ${variants[variant]}`}>
      {message}
    </div>
  );
};