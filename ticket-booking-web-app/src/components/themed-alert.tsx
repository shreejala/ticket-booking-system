import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Props {
  title: string
  message: string
  type: "success" | "error"
}

export const ThemedAlert = ({ title, message, type }: Props) => {
  return (
    <Alert
      variant={type === "error" ? "destructive" : "default"}
      className="mt-2"
    >
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
