import "./BuyInputSection.scss";
import React, { useRef, ReactNode, ChangeEvent, useState } from "react";
import cx from "classnames";
import { Trans } from "@lingui/macro";
import { PERCENTAGE_SUGGESTIONS } from "config/ui";

type Props = {
  topLeftLabel: string;
  topLeftValue?: string;
  topRightLabel?: string;
  topRightValue?: string;
  onClickTopRightLabel?: () => void;
  inputValue?: number | string;
  onInputValueChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClickMax?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  showMaxButton?: boolean;
  staticInput?: boolean;
  children?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  onSelect?: (e: number) => void;
  showPercentSelector?: boolean;
  onPercentChange?: (percentage: number) => void;
};

export default function BuyInputSection(props: Props) {
  const {
    topLeftLabel,
    topLeftValue,
    topRightLabel,
    topRightValue,
    onClickTopRightLabel,
    inputValue,
    onInputValueChange,
    onClickMax,
    onFocus,
    onBlur,
    showMaxButton,
    staticInput,
    children,
    placeholder,
    disabled,
    onSelect,
    showPercentSelector,
    onPercentChange,
  } = props;
  const [isPercentSelectorVisible, setIsPercentSelectorVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleOnFocus() {
    if (showPercentSelector && onPercentChange) {
      setIsPercentSelectorVisible(true);
    }
    onFocus?.();
  }

  function handleOnBlur() {
    if (showPercentSelector && onPercentChange) {
      setIsPercentSelectorVisible(false);
    }
    onBlur?.();
  }

  function handleBoxClick() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }
  const seperator = ":";

  return (
    <div>
      <div className="Exchange-swap-section buy-input" onClick={handleBoxClick}>
        <div className="buy-input-top-row">
          <div className="text-gray">
            {topLeftLabel}
            {topLeftValue && `${seperator} ${topLeftValue}`}
          </div>
          <div className={cx("align-right", { clickable: onClickTopRightLabel })} onClick={onClickTopRightLabel}>
            <span className="text-gray">{topRightLabel}</span>
            {topRightValue && (
              <span className="Exchange-swap-label">
                {topRightLabel ? seperator : ""}&nbsp;{topRightValue}
              </span>
            )}
          </div>
        </div>
        <div className="Exchange-swap-section-bottom">
          <div className="Exchange-swap-input-container">
            {!staticInput && (
              <input
                disabled={disabled}
                type="number"
                min="0"
                placeholder={placeholder || "0.0"}
                step="any"
                className="Exchange-swap-input"
                value={inputValue}
                onChange={onInputValueChange}
                ref={inputRef}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
              />
            )}
            {staticInput && <div className="InputSection-static-input">{inputValue}</div>}
            {showMaxButton && (
              <button type="button" className="Exchange-swap-max" onClick={onClickMax}>
                <Trans>MAX</Trans>
              </button>
            )}
          </div>
          <div className="PositionEditor-token-symbol">{children}</div>
          {
            onSelect &&
            <div className="Exchange-swap-section-model" >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(p => (
                <div key={p} onClick={() => {
                  // setMonth(p);
                  onSelect(p);
                }} className="Exchange-swap-section-model-item" >
                  <label style={{ width: 20 }} >{p}</label>
                  <label><Trans>Month</Trans></label>
                </div>
              ))}
            </div>
          }
        </div>
      </div>

      {showPercentSelector && isPercentSelectorVisible && onPercentChange && (
        <ul className="PercentSelector">
          {PERCENTAGE_SUGGESTIONS.map((percentage) => (
            <li
              className="PercentSelector-item"
              key={percentage}
              onMouseDown={() => {
                onPercentChange?.(percentage);
                handleOnBlur();
              }}
            >
              {percentage}%
            </li>
          ))}
        </ul>
      )}
    </div>

    // <div>
    //   <div className="Exchange-swap-section buy-input" onClick={handleBoxClick}>
    //     <div className="buy-input-top-row">
    //       <div className="text-gray">
    //         {topLeftLabel}
    //         {topLeftValue && `${seperator} ${topLeftValue}`}
    //       </div>
    //       <div className={cx("align-right", { clickable: onClickTopRightLabel })} onClick={onClickTopRightLabel}>
    //         <span className="text-gray">{topRightLabel}</span>
    //         {topRightValue && (
    //           <span className="Exchange-swap-label">
    //             {topRightLabel ? seperator : ""}&nbsp;{topRightValue}
    //           </span>
    //         )}
    //       </div>
    //     </div>
    //     <div className="Exchange-swap-section-bottom">
    //       <div className="Exchange-swap-input-container">
    //         {!staticInput && (
    //           <input
    //             type="number"
    //             min="0"
    //             placeholder="0.0"
    //             step="any"
    //             className="Exchange-swap-input"
    //             value={inputValue}
    //             onChange={onInputValueChange}
    //             ref={inputRef}
    //             onFocus={handleOnFocus}
    //             onBlur={handleOnBlur}
    //           />
    //         )}
    //         {staticInput && <div className="InputSection-static-input">{inputValue}</div>}
    //         {showMaxButton && (
    //           <button type="button" className="Exchange-swap-max" onClick={onClickMax}>
    //             <Trans>MAX</Trans>
    //           </button>
    //         )}
    //       </div>
    //       <div className="PositionEditor-token-symbol">{children}</div>
    //     </div>
    //   </div>
    //   <div className="Exchange-swap-section-bottom">
    //     <div className="Exchange-swap-input-container">
    //       {!staticInput && (
    //         <input
    //           disabled={disabled}
    //           type="number"
    //           min="0"
    //           placeholder={placeholder || "0.0"}
    //           step="any"
    //           className="Exchange-swap-input"
    //           value={inputValue}
    //           onChange={onInputValueChange}
    //           ref={inputRef}
    //           onFocus={onFocus}
    //           onBlur={onBlur}
    //         />
    //       )}
    //       {staticInput && <div className="InputSection-static-input">{inputValue}</div>}
    //       {showMaxButton && (
    //         <button type="button" className="Exchange-swap-max" onClick={onClickMax}>
    //           <Trans>MAX</Trans>
    //         </button>
    //       )}
    //     </div>
    //     <div className="PositionEditor-token-symbol">{children}</div>
    //   </div>
    //   {
    //     onSelect &&
    //     <div className="Exchange-swap-section-model" >
    //       {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(p => (
    //         <div key={p} onClick={() => {
    //           // setMonth(p);
    //           onSelect(p);
    //         }} className="Exchange-swap-section-model-item" >
    //           <label style={{ width: 20 }} >{p}</label>
    //           <label><Trans>Month</Trans></label>
    //         </div>
    //       ))}
    //     </div>
    //   }
    //   {showPercentSelector && isPercentSelectorVisible && onPercentChange && (
    //     <ul className="PercentSelector">
    //       {PERCENTAGE_SUGGESTIONS.map((percentage) => (
    //         <li
    //           className="PercentSelector-item"
    //           key={percentage}
    //           onMouseDown={() => {
    //             onPercentChange?.(percentage);
    //             handleOnBlur();
    //           }}
    //         >
    //           {percentage}%
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </div>
  );
}



