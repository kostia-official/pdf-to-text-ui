import { Progress } from "@mantine/core";
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 8px;
`;

export const FileInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: flex-end;
`;

export const NewlineableText = styled.div`
  white-space: pre-line;
`;

export const ProgressBar = styled(Progress)`
  .mantine-Progress-section {
    transition: width 400ms ease-out;
  }
`;
