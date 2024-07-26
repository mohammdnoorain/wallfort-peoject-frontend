import { useState, useEffect } from "react";
import "./Paginate.scss"



function Pagination({ currentPage, setCurrentPage, totalPage }) {
  const [finalpage, setFinalpage] = useState(0);
  const [firsipage, setFirsipage] = useState(1)
  const [lastPage, setLastPage] = useState(firsipage + 7)
  const [pages, setPages] = useState([])


  useEffect(() => {
    let arr = []
    if (finalpage > 7) {
      // console.log(firsipage)
      // console.log(lastPage)
      // console.log(finalpage)
      for (let index = firsipage; index <= lastPage; index++) {
        if (index <= finalpage) {

          arr.push(index)
        }

      }

    } else {
      for (let index = firsipage; index <= finalpage; index++) {
        if (index <= finalpage) {

          arr.push(index)
        }

      }

    }
    setPages(arr)
  }, [firsipage, lastPage, finalpage, totalPage])



  useEffect(() => {


    if (((lastPage - firsipage) / 2) <= (currentPage - firsipage)) {
      setFirsipage(currentPage)
      setLastPage(currentPage + 7)
    }
    if (((lastPage - firsipage) / 2) >= (currentPage - firsipage)) {
      if (currentPage <= 8) {
        setFirsipage(1)
        setLastPage(8)
      } else if (currentPage > finalpage - 7) {
        setFirsipage(finalpage - 7)
        setLastPage(finalpage)

      }
      else {
        setLastPage(currentPage)
        setFirsipage(currentPage - 7)
      }
    }

  }, [currentPage])

  useEffect(() => {
    const totalcount = totalPage;
    const perpageCount = 40
    const totalpages = Math.ceil(totalcount / perpageCount);
    setFinalpage(totalpages)

  }, [totalPage])

  const handleFirstClick = () => {
    setFirsipage(1)
    setCurrentPage(1)
    setLastPage(8)
  }

  const handleLastClick = () => {
    setCurrentPage(finalpage);
    setLastPage(finalpage)
    if ((finalpage - 7) > 0) {

      setFirsipage(finalpage - 7);

    }
    else {
      setFirsipage(1);
    }
  }
  const handleClick = (e) => {
    setCurrentPage(e)
  }
  const handlenext = () => {

    if ((currentPage) < finalpage) {

      setCurrentPage(prev => prev + 1)
    }
  }

  return (
    <>
      <div className='paginate-ul'>

        <button onClick={handleFirstClick} >&laquo;</button>
        <button onClick={() => setCurrentPage(prev => prev - 1)} >&lsaquo;</button>
        {pages.map((e) => {
          if (e === currentPage) {
            return (
              <button style={{ backgroundColor: "green", color: "white" }} onClick={() => handleClick(e)} >{e}</button>
            )
          }
          else {
            return (
              <button onClick={() => handleClick(e)} >{e}</button>
            )
          }
        }
        )
        }
        <button onClick={handlenext} >&rsaquo;</button>
        <button onClick={handleLastClick}>&raquo;</button>
      </div>
    </>
  )
}

export default Pagination
