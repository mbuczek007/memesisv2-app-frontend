import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from '@emotion/styled';

const ButtonLoading = ({ loading, ctaText, isDisabled }) => {
  return (
    <ButtonWrapper>
      <StyledButton
        type='submit'
        size='large'
        fullWidth
        variant='contained'
        color='primary'
        disabled={loading || isDisabled}
      >
        {ctaText}
      </StyledButton>
      {loading && <Loader color='primary' size={24} />}
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.div`
  position: relative;
`;

const StyledButton = styled(Button)`
  margin: ${({ theme }) => theme.spacing(3, 0, 2)};
`;

const Loader = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -9px;
  margin-left: -12px;
`;

export default ButtonLoading;
