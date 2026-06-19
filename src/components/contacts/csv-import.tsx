"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";

interface CSVImportProps {
  onImport: (data: any[]) => void;
  onError: (error: string) => void;
}

export function CSVImport({ onImport, onError }: CSVImportProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processCSV = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      // Verificar se é um arquivo CSV
      if (!file.name.endsWith(".csv")) {
        throw new Error("O arquivo deve estar no formato CSV");
      }

      const text = await file.text();
      const lines = text.split("\n");

      // Verificar se há conteúdo
      if (lines.length < 2) {
        throw new Error("O arquivo CSV está vazio ou não contém dados");
      }

      // Extrair cabeçalhos
      const headers = lines[0].split(",").map((h) => h.trim());

      // Verificar cabeçalhos necessários
      if (!headers.includes("phone") && !headers.includes("telefone")) {
        throw new Error(
          "O arquivo CSV deve conter uma coluna 'phone' ou 'telefone'"
        );
      }

      // Processar linhas
      const data = lines
        .slice(1)
        .filter((line) => line.trim() !== "")
        .map((line) => {
          const values = line.split(",").map((v) => v.trim());
          return headers.reduce((obj, header, i) => {
            obj[header] = values[i];
            return obj;
          }, {} as Record<string, string>);
        });

      setSuccess(true);
      onImport(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao processar o arquivo CSV";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      processCSV(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      processCSV(file);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Importar Contatos</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20"
          } transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold">
              Arraste seu arquivo CSV aqui
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              ou clique para selecionar um arquivo
            </p>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              id="csv-upload"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("csv-upload")?.click()}
              disabled={isProcessing}
            >
              Selecionar Arquivo
            </Button>
          </div>
        </div>

        {fileName && (
          <div className="mt-4 text-sm">
            <span className="font-medium">Arquivo:</span> {fileName}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-500/10 text-green-500 rounded-md flex items-start gap-2">
            <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>Arquivo importado com sucesso!</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <p>
          O arquivo CSV deve conter pelo menos uma coluna chamada
          &quot;phone&quot; ou &quot;telefone&quot;. Formato recomendado:
          nome,telefone
        </p>
      </CardFooter>
    </Card>
  );
}
