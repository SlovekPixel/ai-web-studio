import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api/errors";

type QueryStateProps = {
  isLoading: boolean;
  error: unknown;
  children: React.ReactNode;
  loadingRows?: number;
};

export function QueryState({
  isLoading,
  error,
  children,
  loadingRows = 4,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: loadingRows }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Не удалось загрузить данные</AlertTitle>
        <AlertDescription>
          {getErrorMessage(error, "Произошла неизвестная ошибка")}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}
