import React, {useMemo} from "react";

function usePagination<T>(data: T[], perPage = 5) {
    const [page, setPage] = React.useState<number>(1);

    const firstPage = page === 1;
    const lastPage = page * perPage >= data.length;

    const paginatedData = useMemo(() => {
        return data.slice((page - 1) * perPage, page * perPage);
    }, [page, data]);

    return [paginatedData, {setPage, firstPage, lastPage}] as const;
}

export default usePagination;