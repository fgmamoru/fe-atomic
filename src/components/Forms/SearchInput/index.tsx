import styles from './SearchInput.module.css';


export type SearchInputProps = {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchInput = (props: SearchInputProps) => {
    return (
        <div className={styles.SearchInput}>
            <img src="/icons/search.svg" alt="Search icon" />
            <input
                type="text"
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    )
};