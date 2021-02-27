import React, { useMemo } from "react";
import {
  usePagination,
  useTable,
  useSortBy,
  useFilters,
  useExpanded
  // useGlobalFilter
} from "react-table";

import { person } from "../synthea_cdm_json/person.json";
import { death } from "../synthea_cdm_json/death.json";
import { visit_occurrence } from "../synthea_cdm_json/visit_occurrence.json";
import { condition_occurrence } from "../synthea_cdm_json/condition_occurrence.json";

import { format } from "date-fns";
import ColumnFilter from "./ColumnFilter";

import { BiChevronLeft } from "react-icons/bi";
import { BiChevronRight } from "react-icons/bi";
import { BiChevronsLeft } from "react-icons/bi";
import { BiChevronsRight } from "react-icons/bi";
import { BiChevronDown } from "react-icons/bi";
import { BiChevronUp } from "react-icons/bi";
import { AiFillCaretDown } from "react-icons/ai";
import { AiFillCaretUp } from "react-icons/ai";

function PersonTable() {
  const data = useMemo(
    () =>
      person.map(one => {
        let filtered = death.filter(
          dead => one.person_id === dead.person_id && dead.death_date
        );
        let age = getAge(one.birth_datetime);

        return filtered.length === 0
          ? (one = { ...one, dead: "X", age: age })
          : (one = { ...one, dead: "O", age: age });
      }),
    []
  );

  const columns = useMemo(
    () => [
      {
        // Make an expander cell
        Header: "상세정보", // No header
        id: "expander", // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? (
              <BiChevronDown style={{ fontSize: "1.5rem", color: "#777" }} />
            ) : (
              <BiChevronUp style={{ fontSize: "1.5rem", color: "#777" }} />
            )}
          </span>
        )
      },
      {
        Header: "ID",
        accessor: "person_id",
        Filter: ColumnFilter,
        disableFilters: true
      },
      { Header: "성별", accessor: "gender_source_value", Filter: ColumnFilter },
      {
        Header: "생년월일",
        accessor: "birth_datetime",
        Cell: ({ value }) => {
          return format(new Date(value), "yyyy-MM-dd");
        },
        Filter: ColumnFilter,
        disableFilters: true
      },
      { Header: "나이", accessor: "age", Filter: ColumnFilter },
      { Header: "인종", accessor: "race_source_value", Filter: ColumnFilter },
      {
        Header: "민족",
        accessor: "ethnicity_source_value",
        Filter: ColumnFilter
      },
      { Header: "사망 여부", accessor: "dead", Filter: ColumnFilter }
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data
    },
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  // console.log(data);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, expanded }
  } = tableInstance;

  return (
    // <div></div>
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  // style={{
                  //   background: "aliceblue",
                  //   color: "black",
                  //   fontWeight: "bold"
                  // }}
                >
                  {column.render("Header")}
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <AiFillCaretDown />
                    ) : (
                      <AiFillCaretUp />
                    )
                  ) : (
                    ""
                  )}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <React.Fragment key={row.getRowProps().key}>
                <tr>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
                {row.isExpanded ? (
                  <tr>
                    <div
                      style={{
                        padding: "1rem"
                      }}
                    >
                      <strong>전체 방문수 </strong>
                      <span>
                        {
                          visit_occurrence.filter(
                            visit => visit.person_id === row.values.person_id
                          ).length
                        }
                      </span>
                      <br />
                      <strong>진찰 정보</strong>
                      <br />
                      <span>
                        {condition_occurrence
                          .filter(
                            condition =>
                              condition.person_id === row.values.person_id
                          )
                          .map(filtered => filtered.condition_concept_id)
                          .join(", ")}
                      </span>
                    </div>
                  </tr>
                ) : null}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <div className="pagination-child">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <BiChevronsLeft />
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            <BiChevronLeft />
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            <BiChevronRight />
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <BiChevronsRight />
          </button>
        </div>
        <div className="pagination-child">
          {pageIndex + 1} / {pageOptions.length}{" "}
        </div>
        <div className="pagination-child">
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}개씩 보기
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

export default PersonTable;

function getAge(birthDate) {
  let today = new Date();
  let birthDay = new Date(birthDate);
  return today.getFullYear() - birthDay.getFullYear();
}
