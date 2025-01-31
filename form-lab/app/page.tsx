'use client'
import styles from "./page.module.css";
import { useRef, useState } from "react";
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { FileUpload, FileUploadFilesEvent } from 'primereact/fileupload';
import axios from "axios";

export default function Home() {

  const [selectedTurno, setSelectedTurno] = useState(null);
  const [selectedElemento, setSelectedElemento] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState(null);
  const fileuploadRef = useRef<FileUpload>(null)

  const turnos = ["A", "B"];
  const elementos = ["Au", "Ag"]
  const estados = ["A", "B"]

  const labels = [
    ["S. Pregnant 1", "S. Pregnant 6", "S. Pregnant 11", "S. Pregnant 16", "S. Pregnant 21"],
    ["S. Pregnant 2", "S. Pregnant 7", "S. Pregnant 12", "S. Pregnant 17", "S. Pregnant 22"],
    ["S. Pregnant 3", "S. Pregnant 8", "S. Pregnant 13", "S. Pregnant 18", "S. Pregnant 23"],
    ["S. Pregnant 4", "S. Pregnant 9", "S. Pregnant 14", "S. Pregnant 19", "S. Pregnant 24"],
    ["S. Pregnant 5", "S. Pregnant 10", "S. Pregnant 15", "S. Pregnant 20", "S. Pregnant 25"],
    ["S. Barren 1", "S. Barren 2", "S. Barren 3", "S. Barren 4", "S. Barren 5"]
  ]

  const [inputs, setInputs] = useState<number[][]>(
    Array(6).fill(Array(5).fill(null))
  );

  // Función para manejar el cambio de valor de los inputs
  // eslint-disable-next-line
  const handleInputChange = (rowIndex: number, colIndex: number, value: any) => {
    // Crear una copia de la matriz de inputs
    const newInputs = [...inputs];
    // Crear una copia de la fila específica
    newInputs[rowIndex] = [...newInputs[rowIndex]];
    // Actualizar el valor en la posición correspondiente
    newInputs[rowIndex][colIndex] = value;
    // Establecer el nuevo estado
    setInputs(newInputs);
  };

  const enviarMuestras = async () => {
    if (selectedTurno == null || selectedElemento == null || selectedEstado == null) {
      return alert("Debe seleccionar el turno, elemento y estado a registrar")
    }
    await axios.post("http://localhost:3001/lab/muestras", {
      valores: inputs,
      turno: selectedTurno,
      elemento: selectedElemento,
      estado: selectedEstado,
      labels: labels
    })
      .then(response => {
        alert(response.data.message)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const handleUpload = async (event: FileUploadFilesEvent) => {
    const fileA = event.files[0]
    const fileB = event.files[1]
    const formData = new FormData()
    formData.append('files', fileA)
    formData.append('files', fileB)
    await axios.post('http://localhost:3001/files/leer-excel', formData)
      .then(response => {
        alert(response.data.message)
        fileuploadRef.current?.clear()
      })
      .catch(error => {
        console.error(error)
        alert("Error al cargar el archivo")
      })

  }

  return (
    <div className={styles.page}>

      <div className="flex flex-row px-5" style={{ backgroundColor: "#182A3B" }}>
        <div className="flex align-items-center justify-content-center mr-5">
          <Image src="images/logo-summa-gold.png" alt="Image" width="200" />
        </div>
        <div className="flex align-items-center justify-content-center">
          <h2 style={{ color: "whitesmoke" }}>LABORATORIO QUÍMICO</h2>
        </div>
      </div>
      <br />
      <div className="flex flex-row align-items-center">
        <Dropdown showClear value={selectedTurno} onChange={(e) => setSelectedTurno(e.value)} options={turnos} placeholder="Turno" className="w-full md:w-14rem mr-3" />
        <Dropdown showClear value={selectedElemento} onChange={(e) => setSelectedElemento(e.value)} options={elementos} placeholder="Elemento" className="w-full md:w-14rem mr-3" />
        <Dropdown showClear value={selectedEstado} onChange={(e) => setSelectedEstado(e.value)} options={estados} placeholder="Estado" className="w-full md:w-14rem mr-3" />
        <FileUpload
          ref={fileuploadRef}
          accept=".xlsx"
          maxFileSize={1000000}
          emptyTemplate={<p className="m-0">Arrastre y suelte un archivo aquí para cargar</p>}
          customUpload
          uploadHandler={(e) => handleUpload(e)}
          chooseLabel="Seleccionar"
          uploadLabel="Subir"
          cancelLabel="Cancelar"
          multiple
        />
      </div>
      <br />
      <div className="flex flex-row justify-content-around">
        <div>CIRCUITO 1</div>
        <div>CIRCUITO 2</div>
        <div>CIRCUITO 3</div>
        <div>CIRCUITO 4</div>
        <div>CIRCUITO 5</div>
      </div>
      <hr />
      <div>
        {
          inputs.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row justify-content-around mb-3">
              {
                row.map((value, colIndex) => (
                  <div key={colIndex}>
                    <label >{labels[rowIndex][colIndex]}</label>
                    <InputNumber
                      value={value}
                      onValueChange={(e) => handleInputChange(rowIndex, colIndex, e.value)}
                      size={3}
                      style={{ marginRight: '25px', marginLeft: '10px' }}
                    />
                  </ div>
                ))
              }
            </div>
          ))
        }
      </div>
      <br />
      <div className="flex flex-row justify-content-center">
        <Button label="Guardar" size="small" onClick={enviarMuestras} />
      </div>

    </div>
  );
}
