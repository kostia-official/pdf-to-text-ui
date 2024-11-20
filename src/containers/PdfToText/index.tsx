import React, { useCallback, useState } from "react";
import { ActionIcon, Button, Card, FileInput } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { IconX } from "@tabler/icons-react";
import { pdfService } from "../../services/pdf.service";
import {
  FileInputWrapper,
  NewlineableText,
  ProgressBar,
  Wrapper,
} from "./styled";
import { AnimatePresence } from "framer-motion";
import { Fade } from "../../components/Fade";
import { AxiosError, AxiosProgressEvent } from "axios";
import { notifications } from "@mantine/notifications";
import { CANCELED_REQUEST_MESSAGE, HttpStatus } from "../../constants";

export const PdfToText: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedText, setParsedText] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onUploadProgress = useCallback((e: AxiosProgressEvent) => {
    if (!e.total) return;
    setUploadProgress((e.loaded / e.total) * 100);
  }, []);

  const {
    mutateAsync: parsePdfTextMutation,
    reset: resetParsing,
    isPending,
  } = useMutation({
    mutationFn: async (file: File) =>
      pdfService.parsePdfText(file, onUploadProgress),
  });

  const clearParsingState = useCallback(() => {
    setFile(null);
    setParsedText(null);
    setUploadProgress(0);

    if (isPending) {
      resetParsing();
      pdfService.cancelPdfParse();
    }
  }, [isPending, resetParsing]);

  const getErrorMessage = useCallback((status: number | undefined) => {
    if (status === HttpStatus.UnprocessableEntity) {
      return "Can't parse your PDF.";
    }

    return "Something went wrong.";
  }, []);

  const onError = useCallback(
    (err: Error) => {
      if (err.message === CANCELED_REQUEST_MESSAGE) return;

      const axiosError = err as AxiosError;
      const message = getErrorMessage(axiosError.status);

      notifications.show({
        message,
        color: "red",
        bg: "red.2",
      });
    },
    [getErrorMessage]
  );

  const onUpload = useCallback(async () => {
    if (!file) return;

    try {
      const result = await parsePdfTextMutation(file);
      setParsedText(result);
    } catch (err) {
      clearParsingState();
      onError(err as Error);
    }
  }, [clearParsingState, file, onError, parsePdfTextMutation]);

  return (
    <Wrapper>
      <FileInputWrapper>
        <FileInput
          label="Select your PDF"
          placeholder="Click here to select the file..."
          value={file}
          onChange={setFile}
          w="300px"
          accept="application/pdf"
          rightSection={
            file && (
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={clearParsingState}
              >
                <IconX />
              </ActionIcon>
            )
          }
        />

        {!parsedText && (
          <Button disabled={!file} onClick={onUpload} loading={isPending}>
            Upload
          </Button>
        )}
      </FileInputWrapper>

      <AnimatePresence mode="wait">
        {!!uploadProgress && !parsedText && (
          <Fade key="progress-bar">
            <ProgressBar.Root size="xl">
              <ProgressBar.Section value={uploadProgress} animated striped>
                {uploadProgress === 100 && (
                  <Fade key="progress-label">
                    <ProgressBar.Label>Parsing your pdf...</ProgressBar.Label>
                  </Fade>
                )}
              </ProgressBar.Section>
            </ProgressBar.Root>
          </Fade>
        )}

        {parsedText && (
          <Fade key="parsed-text">
            <Card withBorder>
              <NewlineableText>{parsedText}</NewlineableText>
            </Card>
          </Fade>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};
